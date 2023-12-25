import CardMediaItems from '@/components/Card/CardMediaItems'
import CardText from '@/components/Card/CardText'
import { PlayCircleIcon } from '@heroicons/react/24/outline'
import { UserRewind } from '../RewindStories'
import StoryWrapper from './Wrapper'

export default function StoryShows({
  userRewind,
  isPaused,
  pause,
  resume,
}: UserRewind) {
  return (
    <StoryWrapper isPaused={isPaused} pause={pause} resume={resume}>
      {userRewind.shows_total_duration ? (
        <>
          <CardText scaleDelay={3}>
            <p>
              <span className='rewind-cat'>
                TV Shows
                <PlayCircleIcon />
              </span>{' '}
              took up{' '}
              <span className='rewind-stat'>
                {userRewind.shows_total_duration}
              </span>{' '}
              of your year on <span className='text-yellow-500'>Plex</span>.
            </p>
          </CardText>

          <CardText renderDelay={3} noScale>
            <p className='mb-2'>
              Your favorite was{' '}
              <span className='rewind-cat'>
                {userRewind.shows_top[0].title}
              </span>
              !
            </p>

            <div className='text-base not-italic'>
              <CardMediaItems
                type='show'
                items={Array(userRewind.shows_top[0])}
                serverId={userRewind.server_id}
                rows
              />
            </div>
          </CardText>
        </>
      ) : (
        <CardText noScale>
          <p>
            You haven&apos;t watched any{' '}
            <span className='rewind-cat'>
              TV Shows
              <PlayCircleIcon />
            </span>{' '}
            on <span className='text-yellow-500'>Plex</span> this year{' '}
            <span className='not-italic'>😥</span>
          </p>
        </CardText>
      )}
    </StoryWrapper>
  )
}
