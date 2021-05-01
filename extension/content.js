// document.addEventListener('yt-navigate-start', processPage);
document.addEventListener('yt-navigate-finish', processPage);
document.addEventListener('scroll', () => debounce(processPage, 500));
document.addEventListener('DOMContentLoaded', processPage);


// on document ready
jQuery(function () {
    processPage();
});

var working = false;

function processPage() {
    console.log('processPage');

    if (working || !jQuery.ready) {
        return;
    }

    // handle result page
    if (location.pathname.startsWith('/results')) {
        setTimeout(handleResultPage(), 1000);
    }

    else if (location.pathname.startsWith('/watch')) {
        setTimeout(handleWatchPage, 1000);
    }
    working = false;
}


function handleResultPage() {
    $(".youtube-saver-main-button").remove();
    $(".youtube-saver-button").remove();

    // foreach video
    jQuery("ytd-video-renderer").each((i, el) => {

        let aElem = jQuery(el).find("a#video-title");
        let title = jQuery(aElem).attr('title');
        let href = jQuery(aElem).attr('href');
        let videoId = href.split("=")[1].split("&")[0];

        // add button if don't exists
        if (!jQuery("#saveBtn-" + videoId).length) {
            console.log('add button', videoId);
            let videoThumbnail = jQuery(el).find("ytd-thumbnail");
            var $button = jQuery('<button/>', {
                type: 'button',
                class: 'youtube-saver-button',
                id: 'saveBtn-' + videoId,
                title,
                text: isInStorage(videoId) ? "✅" : "⬇️",
                click: function () { saveVideo(this, videoId, this.title); }
            });

            // append button to video thumbnail
            $button.appendTo(videoThumbnail);
        }
    })
}


function handleWatchPage() {

    $(".youtube-saver-main-button").remove();
    $(".youtube-saver-button").remove();

    // main video
    let urlParams = new URLSearchParams(window.location.search);
    let mainVideoId = urlParams.get('v');
    let mainVideoTitle = jQuery('h1 > .ytd-video-primary-info-renderer').first().text();
    console.log('main video', mainVideoTitle, mainVideoId);
    // add button if don't exists
    if (!jQuery("#saveBtn-" + mainVideoId).length && !!mainVideoTitle && !!mainVideoId) {
        console.log('add main button', mainVideoId);
        let h1 = jQuery('h1 > .ytd-video-primary-info-renderer').first();
        var $button = jQuery('<button/>', {
            type: 'button',
            class: 'youtube-saver-main-button',
            id: 'saveBtn-' + mainVideoId,
            title: mainVideoTitle,
            text: isInStorage(mainVideoId) ? "✅" : "⬇️",
            click: function () { saveVideo(this, mainVideoId, this.title); }
        });

        // append button to video thumbnail
        $button.appendTo(h1);
    }


    // sidebar thumbnails
    jQuery("ytd-compact-video-renderer").each((i, el) => {

        let videoId = jQuery(el).find("a#thumbnail").attr('href').split("=")[1].split("&")[0];
        let title = jQuery(el).find("span#video-title").attr('title');

        // add button if don't exists
        if (!jQuery("#saveBtn-" + videoId).length) {
            console.log('add button', videoId);
            let videoThumbnail = jQuery(el).find("ytd-thumbnail");
            var $button = jQuery('<button/>', {
                type: 'button',
                class: 'youtube-saver-button',
                id: 'saveBtn-' + videoId,
                title,
                text: isInStorage(videoId) ? "✅" : "⬇️",
                click: function () { saveVideo(this, videoId, this.title); }
            });

            // append button to video thumbnail
            $button.appendTo(videoThumbnail);
        }
    })
}

function saveVideo(buttonElement, id, title) {
    console.log('save', id, title);
    jQuery(buttonElement).text("⏳");
    fetch('http://localhost:8080/save?id=' + id + '&title=' + encodeURIComponent(title)).then(res => {
        jQuery(buttonElement).text("✅");
        setStorage(id);
    }).catch(err => {
        jQuery(buttonElement).text("❌");
    });
}


// add new video id to storage
function setStorage(id) {
    // get current storage
    let obj = JSON.parse(localStorage.getItem('youtube-saver')) || {};

    // add key to current
    obj[id] = true;
    localStorage.setItem('youtube-saver', JSON.stringify(obj));
}

// check if video id already in storage
function isInStorage(id) {
    let obj = JSON.parse(localStorage.getItem('youtube-saver'));
    if (obj && obj[id]) {
        return true;
    }
    return false;
}

// simple debound function
function debounce(method, delay) {
    clearTimeout(method._tId);
    method._tId = setTimeout(function () {
        method();
    }, delay);
}