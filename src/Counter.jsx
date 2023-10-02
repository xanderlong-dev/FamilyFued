export default function Counter({points, id, activeTeam}) {
    return (
        <div className={`counter ${activeTeam ? 'active' : ''}`} id={`${id}`}>
            {points}
        </div>
    )
}