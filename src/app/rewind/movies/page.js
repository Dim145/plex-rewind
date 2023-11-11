import CardContent from '@/components/CardContent'
import CardText from '@/components/CardText'
import { ALLOWED_PERIODS, metaDescription } from '@/utils/constants'
import { fetchUser } from '@/utils/fetchOverseerr'
import fetchTautulli from '@/utils/fetchTautulli'
import { removeAfterMinutes } from '@/utils/formatting'
import { FilmIcon } from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Movies | Plex rewind',
  description: metaDescription,
}

async function getTotalDuration() {
  const user = await fetchUser()
  const totalDuration = await fetchTautulli('get_history', {
    user_id: user.plexId,
    section_id: 3,
    after: ALLOWED_PERIODS.thisYear.string,
    length: 0,
  })

  return removeAfterMinutes(totalDuration.response?.data?.total_duration)
}

export default async function Movies() {
  const [totalDuration, user] = await Promise.all([
    getTotalDuration(),
    fetchUser(),
  ])

  return (
    <CardContent
      title='Movies'
      page='4 / 5'
      prevCard='/rewind/shows'
      nextCard='/rewind/music'
      subtitle={user.plexUsername}
    >
      <CardText noScale>
        {totalDuration != 0 ? (
          <p>
            <span className='rewind-stat'>{totalDuration}</span> of your time
            was spent watching{' '}
            <span className='inline-flex text-teal-300'>
              Movies
              <FilmIcon className='ml-1 w-8' />
            </span>{' '}
            on <span className='text-yellow-500'>Plex</span> this year.
          </p>
        ) : (
          <p>
            You haven&apos;t watched any{' '}
            <span className='inline-flex text-teal-300'>
              Movies
              <FilmIcon className='ml-1 w-8' />
            </span>{' '}
            on <span className='text-yellow-500'>Plex</span> this year{' '}
            <span className='not-italic'>🥹</span>
          </p>
        )}
      </CardText>
    </CardContent>
  )
}
