
      const $ = document.querySelector.bind(document);
      const $$ = document.querySelectorAll.bind(document);

      const player = $('.player');
      const heading = $('header h2');
      const cdThumd = $('.cd-thumb');
      const audio = $('#audio');
      const cd = $('.cd');
      const playBtn = $('.btn-toggle-play');

      const progess = $('.progress')

      const nextBtn = $('.btn-next');
      const prevBtn = $('.btn-prev');

      const randomBtn = $('.btn-random');
      const repeatBtn = $('.btn-repeat');

      const playList = $('.playlist');
      const listSong = $('.song');     

      const PLAYER_STORAGE_KEY = 'PLAYER'

      const app = {
        songs: [
        {
          name: 'Không tin 1 sớm mai bình yên',
          singer: 'Jusstatee',
          path: './accsets/songs/song1.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: 'Beat of celebration',
          singer: 'Jusstatee',
          path: './accsets/songs/song2.mp3',
          image: './accsets/img/img2.jpg'
        },

        {
          name: 'Tay to',
          singer: 'MCK',
          path: './accsets/songs/song3.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: 'The Rain',
          singer: 'Rapital',
          path: './accsets/songs/song4.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: 'Thủ Đô',
          singer: 'MCK',
          path: './accsets/songs/song5.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: 'XTC',
          singer: 'Tlinh, MCK',
          path: './accsets/songs/song6.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: '1800',
          singer: 'HIEUTHUHAI',
          path: './accsets/songs/song7.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: 'Chạy về khóc với anh',
          singer: 'ERIK',
          path: './accsets/songs/song8.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: 'Đã bao lâu',
          singer: 'Dick',
          path: './accsets/songs/song9.mp3',
          image: './accsets/img/img1.jpg'
        },

        {
          name: 'OCEAN',
          singer: 'MCK',
          path: './accsets/songs/song10.mp3',
          image: './accsets/img/img1.jpg'
        },
      ],

        songPlayed: [
          {
            
          }
        ],
          
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        
        setConfig: function(key, value) {
          this.config[key] = value;
          localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
        },

        render: function() {
          const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>`
          })
          playList.innerHTML = htmls.join('')
        },
       
        defineProperties: function() {
          Object.defineProperty(this, 'currentSong', {
            get: function() {
              return this.songs[this.currentIndex]
            }
          })
        },

        currentIndex: 0,

        isPlaying: false,
        

        handleEvent: function() {
          const _this = this;

          //Xử lý cdthumb quay/dừng

         const cdThumdAnimate = cdThumd.animate([
            {transform: 'rotate(360deg'}
          ], {
            duration: 10000,
            iterations: Infinity
          })
          cdThumdAnimate.pause();
          
          
          // Xử lí phóng to thu nhỏ khi kéo
          const cdWidth = cd.offsetWidth;

          document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWith = cdWidth - scrollTop;

            cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0;
            cd.style.opacity = newCdWith / cdWidth;
          };


          // Xử lý khi click play
            playBtn.onclick = function() {

              if (_this.isPlaying) {
                audio.pause();
              } else {
                audio.play();
              }

              // Khi song  được play
              audio.onplay = function() {
                
                _this.isPlaying = true
                player.classList.add("playing")
                cdThumdAnimate.play()
                
              };

              // Khi song  bị pause
              audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove("playing")
                cdThumdAnimate.pause()
              };
            };

          // Hiển thị thời gian của song
          const playTime = audio.duration

          
          // Khi tiến độ song thay đổi
            audio.ontimeupdate = function() {
              progessPercent = (audio.currentTime / audio.duration * 100)
              progess.value = progessPercent
            };


          // Xử lý khi tua
            progess.onchange = function(e) {
             const seekTime = e.target.value * audio.duration /100
             audio.currentTime = seekTime
             
            };

          // Xử lý chuyển hoặc lùi sang bài kế tiếp
            nextBtn.onclick = function() {
              if (_this.isRandom) {
                _this.playRandomSong()
              } else {
                _this.nextSong();
              
              }
              _this.render();
              audio.play();
              _this.scrollToActiveSong();
            }

            prevBtn.onclick = function() {
              if (_this.isRandom) {
                _this.playRandomSong();

              } else {
                _this.prevSong();
             
              }
              _this.render();
              audio.play();
              _this.scrollToActiveSong()
            }


          // Kích hoạt random song
            randomBtn.onclick = function() {            
              _this.isRandom = !_this.isRandom;
              _this.setConfig('isRandom', _this.isRandom);
              randomBtn.classList.toggle("active", _this.isRandom)
            }
            

          // Kích hoạt repeat 1 song
              repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat', _this.isRepeat);
                repeatBtn.classList.toggle("active", _this.isRepeat);

              }
                


          // Xử lý khi kết thúc bài hát
              audio.onended = function() {  
                if (_this.isRepeat) {
                  audio.play();
                } else {                 
                  nextBtn.click();
                }  
              }


          // Active song
          

          // Lắng nghe hành vi click vào playlist
          playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('option')
           if ( songNode || songOption)
          {
            if (songNode) {
              _this.currentIndex = Number(songNode.dataset.index)
              _this.loadCurrentSong()
              _this.render()
              audio.play();
            }
            if (songOption) {

            }
          }
          
          
        }
      },
        
        loadConfig: function() {
          this.isRandom = this.config.isRandom
          this.isRepeat = this.config.isRepeat
        },


        loadCurrentSong: function() {
          heading.textContent = this.currentSong.name;
          cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`
          audio.src = this.currentSong.path

        },

        nextSong: function() {
              this.currentIndex++
              if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
              }
              this.loadCurrentSong()

        },

        prevSong: function() {
          this.currentIndex--
          if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
          }
          this.loadCurrentSong()
        },


        playRandomSong: function() {
          let newIndex
              do {
                newIndex= Math.floor(Math.random() * this.songs.length)
              } while (newIndex == this.currentIndex);
              
              this.currentIndex = newIndex;
              this.loadCurrentSong()
            },


          scrollToActiveSong: function() {
            setTimeout(() => {
              $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'end'
              });
            }, 100)
          },


        start: function() {
          // Gán cấu hình cũ khi reload
          this.loadConfig();
          

          // Định nghĩa các thuộc tính cho Object
          this.defineProperties();

          // Lắng nghe/ xử lý các sự kiện (DOM event)
          this.handleEvent();

          //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
          this.loadCurrentSong();
          
          //Render playlist
          this.render();

          randomBtn.classList.toggle("active", this.isRandom);
          repeatBtn.classList.toggle("active", this.isRepeat);
        }
      };

      app.start();

