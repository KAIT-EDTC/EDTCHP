document.getElementById('schedule-pulldown').addEventListener('change', function() {
    const id = this.value;
    fetch(`EventUpdateApi.php?calendar_event_id=${encodeURIComponent(id)}`)
        .then(res => res.json())
        .then(data => {
            // res.json()のパース結果がdata
            document.getElementById('event-description').value = data.description || '';
            document.getElementById('event-start').value = data.start_time || '';
            document.getElementById('event-end').value = data.end_time || '';
            document.getElementById('event-participants').value = data.participants || '';
        });
});
