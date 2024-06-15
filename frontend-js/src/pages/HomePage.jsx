export const HomePage = () => {
  return (
    <>
      <h1>Video Calling App</h1>
      <div className="card">
        <a href="/host"><button className="btn">Create Video Call</button></a>
        <a href="/participant"><button className="btn">Enter on existing Call</button></a>
      </div>
    </>
  )
}