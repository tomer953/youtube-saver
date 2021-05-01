# Youtube-Saver Chrome Extension


This Extension addes a small download icon for every youtube thumbnails.

- supports the /result page
- support the /watch page

When button is clicked a new HTTP POST request is sent to

`http://localhost:8080/save?id=VIDEOID&title=VIDEO_TITLE`

* the title is sent with encodeURIComponent(title)

the local server can process the request to do whatever you want with the youtube id and title.

Note: without the local server this extension is completly useless.
