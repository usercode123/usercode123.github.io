
require(["text!../music/musiclist.json", 
"jquery.min"
], function (dataList) {
    var obj = JSON.parse(dataList);
    //播放列表
    var musicList = obj.list;


    musicList.forEach(function(song){
        $("<li></li>")
        .html("<i class='icon-spinner icon-spin'></i>"+song).appendTo("#list-box")
    })

   
    //当前播放索引
    var musicIndex = -1;
    nextMusic();
    //加载完成时播放
     $("#player")[0].oncanplay = function(){
          $("#player")[0].play();
          $("#lyric-box p").click(function(e){
              var targetLine = $("#lyric-box p").index(e.target);
              var time = lyricArray[targetLine].time;
              $("#player")[0].currentTime = time;
          })
     }

    function nextMusic() {
        musicIndex++;
        if (musicIndex > musicList.length - 1) {
            musicIndex = 0;
        }
        loadMusic();
       
    }
    function preMusic() {
        musicIndex--;
        if (musicIndex < 0) {
            musicIndex = musicList.length-1;
        }
       loadMusic();
       
    }

      //当前播放行数
    var currentLine;

    //存放歌词数组
    var lyricArray;
    //加载歌词与歌曲
    function loadMusic(){
        var musicName = musicList[musicIndex];

        $("#cd").css("background-image","url('music/" + musicName + ".jpg')")
       
        var lfn = "../music/" + musicName + ".lrc";
        require(["text!"+lfn],function(lyric){
            
           
             var reg = /\[(\d\d:\d\d\.\d\d)\](.*)/g
             var arr;
             lyricArray=[];
             while(arr =reg.exec(lyric)){
              
                 var line = {
                     time: seconder(arr[1]),
                     content:arr[2]
                 }
                 lyricArray.push(line);
                  
                
             }
              
              //
              var boxlyric = lyricArray.reduce(function(pre,obj){
                  return pre+"<p>"+obj.content+"</p>";
              },"")
              $("#lyric-box").html(boxlyric)
            
               //歌词完成下载歌曲
             $("#player")[0].src = "music/" + musicName + ".mp3";
             currentLine =0;
            
        })
    }

    //上一首
    $("#preBtn").click(function(){
        $("#player")[0].pause();
        preMusic();
    })
    //下一首
    $("#nextBtn").click(function(){
        $("#player")[0].pause();
        nextMusic();
    })
    var isplay = false;
    //播放按钮
    $("#playBtn").click(function () {

        if (isplay) {
            $("#player")[0].pause();

        } else {
            $("#player")[0].play();
        }
    })
    //进度条
    function changeProgress(e) {
        var prog = e.offsetX / e.target.offsetWidth;
        $("#progress").val(prog);
        //
        $("#player")[0].currentTime = $("#player")[0].duration * prog;

    }
    $("progress").mousedown(function (e) {
        changeProgress(e)

        $("#progress")[0].onmousemove = function (e) {
            changeProgress(e)
        }
    })

    $("#progress").mouseup(function (e) {
        $("#progress")[0].onmousemove = null;
    })
    $("#progress").mouseleave(function (e) {
        $("#progress")[0].onmousemove = null;
    })

    //转换秒数
    function seconder(m){
        var arr = m.split(":");
        return arr[0]*60+arr[1]*1;
    }

    //转化分钟
    function minuter(s) {
        var minute = Math.floor(s / 60);
        var second = Math.floor(s % 60);
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return minute + ":" + second;
    }

  

    //播放进度
    $("#player")[0].ontimeupdate = function (e) {
        var crt = minuter(e.target.currentTime);
        var dur = minuter(e.target.duration);
       
        $("#progress-label").text(crt + "/" + dur);
        if(e.target.currentTime / e.target.duration){
            $("#progress").val(e.target.currentTime / e.target.duration);
        }
        //当前时间点的歌词
        var line = findTime(e.target.currentTime);
       
        if(line!=currentLine||line==0){
       $("#lyric-box p")[currentLine].classList.remove("hight-line");
       $("#lyric-box p")[line].classList.add("hight-line");
       
        currentLine = line;

        var p = $("#lyric-box p")[line];
        //  $("#lyric-box").animate({
        //      scrollTop:p.scrollTop-50
        //  },300,"linear")
        $("#lyric-box")[0].scrollTop = p.offsetTop-100;
        }
    }
    //找到时间点对应的歌词行数
    function findTime(t){
        var i=0;
        while(i<lyricArray.length){
            if(lyricArray[i].time>t){
                return i-1<0?0:i-1;
            }
            i++;

        }
        return lyricArray.length-1;
    }




    //播放结束
    $("#player")[0].onended = function (e) {
        nextMusic();
        $("#playBtn").removeClass("icon-play")
            .addClass("icon-pause");
        isplay = true;
    }
    //开始播放
    $("#player")[0].onplaying = function (e) {
        $("#playBtn").removeClass("icon-play")
            .addClass("icon-pause");
        isplay = true;
        $("#cd").css("animation-play-state","running")
    }
    //暂停播放
    $("#player")[0].onpause = function (e) {
        $("#playBtn").removeClass("icon-pause")
            .addClass("icon-play");
        isplay = false;
         $("#cd").css("animation-play-state","paused")
    }



})