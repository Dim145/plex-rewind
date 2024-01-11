import { authOptions } from '@/lib/auth'
import { TautulliUser, UserRewind } from '@/types'
import { getLibraries, getServerId } from '@/utils/fetchTautulli'
import { secondsToTime } from '@/utils/formatting'
import {
  getLibrariesTotalDuration,
  getRequestsTotals,
  getTopMediaItems,
  getTopMediaStats,
  getUserTotalDuration,
  getlibrariesTotalSize,
} from '@/utils/getRewind'
import { getServerSession } from 'next-auth'
import RewindStories from './_components/RewindStories'

type Props = {
  searchParams: {
    userId?: string
  }
}

export default async function Rewind({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  console.log('Your session is:', session)

  if (!session?.user) {
    return
  }

  let user = session.user
  console.log('Your user data is:', user)
  const managedUserId = searchParams?.userId

  if (managedUserId) {
    console.log("You're a managed user with ID:", managedUserId)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/managed-users?userId=${session.user.id}`,
    )
    const data: TautulliUser[] = await res.json()
    console.log('This is the data for all managed users:', data)
    const managedUser = data?.find(
      (user) => user.user_id === Number(managedUserId),
    )
    console.log('This is your managed user obj:', managedUser)

    if (managedUser) {
      user = {
        image: managedUser.thumb,
        name: managedUser.friendly_name,
        id: managedUserId,
      }
    }
  } else {
    console.log("You're not a managed user!")
  }

  console.log('This is your user obj after managed user checks:', user)

  const libraries = await getLibraries()
  const [
    topMediaItems,
    topMediaStats,
    userTotalDuration,
    librariesTotalSize,
    librariesTotalDuration,
    serverId,
  ] = await Promise.all([
    getTopMediaItems(user.id, libraries),
    getTopMediaStats(user.id, libraries),
    getUserTotalDuration(user.id, libraries),
    getlibrariesTotalSize(libraries),
    getLibrariesTotalDuration(libraries),
    getServerId(),
  ])
  const userRewind: UserRewind = {
    duration: {
      user: secondsToTime(userTotalDuration),
      user_percentage: `${Math.round(
        (userTotalDuration * 100) / librariesTotalDuration,
      )}%`,
      total: secondsToTime(librariesTotalDuration),
    },
    shows: {
      top: topMediaItems.shows,
      count: topMediaStats.shows.count,
      duration: topMediaStats.shows.duration,
    },
    movies: {
      top: topMediaItems.movies,
      count: topMediaStats.movies.count,
      duration: topMediaStats.movies.duration,
    },
    audio: {
      top: topMediaItems.audio,
      count: topMediaStats.audio.count,
      duration: topMediaStats.audio.duration,
    },
    libraries: libraries,
    libraries_total_size: librariesTotalSize,
    server_id: serverId,
    user: user,
  }

  if (process.env.NEXT_PUBLIC_OVERSEERR_URL) {
    const requestTotals = await getRequestsTotals(user.id)

    userRewind.requests = requestTotals
  }

  return <RewindStories userRewind={userRewind} />
}
