/*=============================
18 BANI HASHIM
YouTube API
==============================*/

const API_KEY=CONFIG.API_KEY;

const CHANNEL_ID=CONFIG.CHANNEL_ID;

const MAX_RESULTS = CONFIG.MAX_RESULTS;

const container = document.getElementById("videoContainer");

const url =
`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;

async function loadVideos(){

try{

const response = await fetch(url);

const data = await response.json();

container.innerHTML="";

data.items.forEach(video=>{

if(video.id.kind!=="youtube#video") return;

container.innerHTML+=`

<div class="video-card">

<img
src="${video.snippet.thumbnails.high.url}"
alt="Thumbnail">

<h3>${video.snippet.title}</h3>

<p>

${new Date(video.snippet.publishedAt).toLocaleDateString()}

</p>

<button
onclick="playVideo('${video.id.videoId}')">

Watch Now

</button>

</div>

`;

});

}catch(err){

container.innerHTML="<h2>Unable to load videos.</h2>";

console.error(err);

}

}

loadVideos();

function playVideo(id){

playVideo(id);

"_blank"

);

}
/*=========================================
        CHANNEL STATS
=========================================*/

const statsUrl =
`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`;

async function loadChannelStats(){

    try{

        const response = await fetch(statsUrl);

        const data = await response.json();

        if(!data.items.length) return;

        const channel = data.items[0];

        const stats = channel.statistics;

        const box = document.createElement("section");

        box.className = "channel-stats";

        box.innerHTML = `

        <div class="stat-card">
            <h2>${Number(stats.subscriberCount).toLocaleString()}</h2>
            <p>Subscribers</p>
        </div>

        <div class="stat-card">
            <h2>${Number(stats.videoCount).toLocaleString()}</h2>
            <p>Videos</p>
        </div>

        <div class="stat-card">
            <h2>${Number(stats.viewCount).toLocaleString()}</h2>
            <p>Total Views</p>
        </div>

        `;

        container.parentNode.insertBefore(box,container);

    }catch(err){

        console.log(err);

    }

}

loadChannelStats();



/*=========================================
        VIDEO POPUP PLAYER
=========================================*/

function playVideo(videoId){

    let popup=document.getElementById("videoPopup");

    if(!popup){

        popup=document.createElement("div");

        popup.id="videoPopup";

        popup.innerHTML=`

        <div class="popup-content">

            <span id="closeVideo">&times;</span>

            <iframe
            id="playerFrame"
            allowfullscreen>

            </iframe>

        </div>

        `;

        document.body.appendChild(popup);

    }

    document.getElementById("playerFrame").src=
`https://www.youtube.com/embed/${videoId}?autoplay=1`;

    popup.style.display="flex";

    document.getElementById("closeVideo").onclick=()=>{

        popup.style.display="none";

        document.getElementById("playerFrame").src="";

    };

}



/*=========================================
        LIVE DETECTION
=========================================*/

const liveURL =
`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;

async function checkLive(){

    try{

        const response=await fetch(liveURL);

        const data=await response.json();

        if(data.items.length>0){

            const live=data.items[0];

            const banner=document.createElement("div");

            banner.className="live-banner";

            banner.innerHTML=`

            🔴 LIVE NOW

            <button onclick="playVideo('${live.id.videoId}')">

            Watch Live

            </button>

            `;

            document.body.prepend(banner);

        }

    }catch(e){

        console.log(e);

    }

}

checkLive();

/*==============================
CACHE SYSTEM
==============================*/

function saveCache(name,data){

    localStorage.setItem(name,JSON.stringify({

        time:Date.now(),

        data:data

    }));

}

function getCache(name){

    const cache=localStorage.getItem(name);

    if(!cache) return null;

    const obj=JSON.parse(cache);

    if(Date.now()-obj.time>CONFIG.CACHE_TIME){

        return null;

    }

    return obj.data;

}
/*=========================================
AUTO CHANNEL INFO
=========================================*/

async function loadChannelHeader(){

try{

const url=`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${CONFIG.CHANNEL_ID}&key=${CONFIG.API_KEY}`;

const response=await fetch(url);

const data=await response.json();

if(!data.items || data.items.length===0){

return;

}

const channel=data.items[0];

const stats=channel.statistics;

const snippet=channel.snippet;

/*=====================
HANDLE
=====================*/

const handle=document.getElementById("channelHandle");

if(handle){

handle.innerHTML=`@${snippet.customUrl || "18BaniHashim"}`;

}

/*=====================
STATS
=====================*/

const statsBox=document.getElementById("channelStats");

if(statsBox){

statsBox.innerHTML=`

${Number(stats.subscriberCount).toLocaleString()} Subscribers •
${Number(stats.videoCount).toLocaleString()} Videos •
${Number(stats.viewCount).toLocaleString()} Views

`;

}

/*=====================
DESCRIPTION
=====================*/

const desc=document.querySelector(".channel-description");

if(desc){

desc.innerHTML=snippet.description;

}

}catch(error){

console.log(error);

}

}

loadChannelHeader();
