function TrashIcon({ color = 'gray', size = 24, onClick, tweetId }) {

  //Affiche une icone poubelle
  return (
    <svg
    onClick={() => onClick(tweetId)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
    >
      <path d="M3 6h18v2H3V6zm2 3h14l-1.5 13h-11L5 9zm5 2v9h2v-9h-2zm4 0v9h2v-9h-2zM9 4V2h6v2h5v2H4V4h5z" />
    </svg>
  );
}

export default TrashIcon;