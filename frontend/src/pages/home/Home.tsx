import { Footer } from '../../components/Footer/Footer'

export const Home = () => {
  const handleEnterVideoCall = () => {
    console.log('Enter on existing Call')
  }
  
  return (
    <>
      <h1>Video Calling App</h1>
      <div className="card">
        <a href="/host"><button className="btn">Create Video Call</button></a>
        <button className="btn" onClick={handleEnterVideoCall}>Enter on existing Call</button>
      </div>
      <Footer />
    </>
  )
}