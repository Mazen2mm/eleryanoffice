export default function FirebaseScripts({ xlsx = false, storage = false }) {
  return (
    <>
      <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
      <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
      {storage && (
        <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js"></script>
      )}
      {xlsx && (
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
      )}
    </>
  );
}
