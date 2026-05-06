$(function () {
  // 서버에서 영화 data 가져오는 배열변수
  let movieData = [];
  //   이미지 가져오기 url 주소
  let imgUrl = "https://image.tmdb.org/t/p/original";

  //   api 서버에 data를 요청해서 date json파일 형식으로 가져오기
  //   가져오는 함수
  //   비동기식 데이터 가져오기
  const getMovieDate = async () => {
    // api 서버를 호출
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=0bda5d6b5a7917e8209f970a2db952ee&language=ko-KR&page=1`;
    console.log(url);
    // 데이터를 가져오기 서버에 요청
    let respons = await fetch(url);
    // 요청한 데이터 json 파일 형식으로 가져옴
    let date = await respons.json();
    console.log(date);
    // 서버에서 가져온 date를 내 배열변수에 기억
    movieData = date;
    console.log(movieData);
    // rander 함수 호출
    rander();
  };
  //   getMovieDate 함수를 호출
  getMovieDate();
  //   card ui 반복문 함수
  const rander = () => {
    // li를 추가하는 변수
    let movieCard = "";
    movieData.results.map((item) => {
      movieCard =
        movieCard +
        `<li>
              <a href="#">
                <div class="imgbox">
                  <img src=${imgUrl + item.poster_path} alt="이미지" />
                </div>
                <div class="txtbox">
                  <h3>${item.title}</h3>
                  <p><span>평점${item.vote_average}</span><span>개봉일${item.release_date}</span></p>
                  <div class="btn_wrap">
                    <button class="btn_like">♥${item.vote_count}</button>
                    <button class="btn_date">예매</button>
                    <button class="btn_cinema">CINEMA</button>
                  </div>
                </div>
              </a>
            </li>`;
      // 자바스크립트에서 작업한 변수를 ul 안에 넣어주기
      let list = document.getElementById("list");
      list.innerHTML = movieCard;
    });
  };
});
