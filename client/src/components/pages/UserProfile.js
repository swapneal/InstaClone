import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../App'
import Spinner from './Spinner/Spinner'
import '../styles/profile.css'

const UserProfile = () => {
  const [userprofile, setUserprofile] = useState(null)
  const { state, dispatch } = useContext(UserContext)
  const { profileId } = useParams()

  const [showfollow, setShowfollow] = useState(
    state ? !state.following.includes(profileId) : true
  )

  useEffect(() => {
    fetch(`/profile/${profileId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(result => {
        setUserprofile(result)
      })
      .catch(err => console.log(`Error in Profile loading ${err}`))
      .catch(err => console.log(`Error in Profile loading ${err}`))
  }, [])

  const followUser = () => {
    fetch('/follow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        followId: profileId
      })
    })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'UPDATE',
          payload: {
            following: data.following,
            followers: data.followers
          }
        })
        localStorage.setItem('user', JSON.stringify(data))
        setUserprofile(prevState => {
          return {
            ...prevState,
            payload: {
              ...prevState.payload,
              followers: [...prevState.payload.followers, data.id]
            }
          }
        })
        setShowfollow(false)
      })
  }

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        unfollowId: profileId
      })
    })
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'UPDATE',
          payload: {
            following: data.following,
            followers: data.followers
          }
        })
        localStorage.setItem('user', JSON.stringify(data))
        setUserprofile(prevState => {
          const newFollower = prevState.payload.followers.filter(
            item => item !== data._id
          )
          return {
            ...prevState,
            payload: {
              ...prevState.payload,
              followers: newFollower
            }
          }
        })
        setShowfollow(true)
        window.location.reload()
      })
  }

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      {userprofile === null ? (
        <Spinner />
      ) : (
        <>
          <div
            style={{
              margin: '18px 0px',
              borderBottom: '1px solid grey'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around'
              }}
            >
              <div>
                <img
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '80px'
                  }}
                  src={userprofile ? userprofile.payload.dp : 'loading'}
                  alt='post-pic'
                />
              </div>
              <div>
                <h4>
                  {userprofile ? userprofile.payload.name : 'loading'}{' '}
                  {showfollow ? (
                    <button
                      style={{
                        margin: '10px'
                      }}
                      className='btn waves-effect waves-light #64b5f6 blue darken-1'
                      onClick={() => followUser()}
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      style={{
                        margin: '10px'
                      }}
                      className='btn waves-effect waves-light #64b5f6 blue darken-1'
                      onClick={() => unfollowUser()}
                    >
                      Unfollow
                    </button>
                  )}
                </h4>
                <div className='profile-info'>
                  <h6>
                    {userprofile.posts.length} post
                    {userprofile.posts.length === 1 ? '' : 's'}
                  </h6>
                  <h6>
                    {userprofile ? userprofile.payload.followers.length : '0'}{' '}
                    follower
                    {userprofile.payload.followers.length === 1 ? '' : 's'}
                  </h6>
                  <h6>
                    {userprofile ? userprofile.payload.following.length : '0'}{' '}
                    following
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className='gallery'>
            {userprofile.posts.map(item => {
              return (
                <img
                  key={item._id}
                  className='item'
                  src={item.imageUrl}
                  alt={item.title}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default UserProfile
