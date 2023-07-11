import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import TopFollowNav from '../../components/common/topNav/TopFollowNav';
import TabMenu from '../../components/common/tab/TabMenu';
import PreschoolMap from '../../components/mapInfo/PreschoolMap';
import PreschoolList from '../../components/mapInfo/PreschoolList';
import prevIcon from '../../assets/icon/icon-pagination-prev.svg';
import nextIcon from '../../assets/icon/icon-pagination-next.svg';
// import * as S from './Map.style';
import S from './Map.style';

const Map = (props) => {
  const [kakaoReady, setKakaoReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [allList, setAllList] = useState();
  const [mapList, setMapList] = useState();
  const [searchValue, setSearchValue] = useState('');
  // 페이지네이션을 위한 상태 값과 변수 추가
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 6;

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=17703254ea82341d185ec5149d6948f4&libraries=services';
    script.async = true;

    // 이벤트 리스너 추가해서 kakao.maps 로드 확인
    script.addEventListener('load', () => {
      setKakaoReady(true);
    });

    document.head.appendChild(script);

    return () => {
      // 이벤트 리스너 제거
      script.removeEventListener('load', () => {
        setKakaoReady(true);
      });
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!kakaoReady) {
      // Kakao 지도 API가 로드되지 않았다면 그냥 반환.
      return;
    }

    // 아래는 기존 fetchData와 동일한 코드를 넣습니다.
    fetch(`${process.env.PUBLIC_URL}/preschools.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setList(data.preschools);
        setAllList(data.preschools);
        setMapList(data.preschools);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching JSON data:', error);
      });
  }, [kakaoReady]); // 의존성 배열에 kakaoReady 추가

  // 지도를 다시 그리는 로직을 함수로 분리했습니다.
  const drawMapWithList = (newItemList, level = 4) => {
    if (newItemList.length === 0) {
      // newItemList가 비어 있으면 지도를 다시 그리지 않습니다.
      return;
    }
    if (newItemList.length > 0) {
      const { kakao } = window;
      if (!kakao || !kakao.maps) return;

      const container = document.getElementById('map');
      const coordinates = new kakao.maps.LatLng(
        newItemList[0].lat,
        newItemList[0].lng,
      );
      const options = {
        center: coordinates,
        level: level,
      };

      const kakaoMap = new kakao.maps.Map(container, options);

      // 지도에 마커를 표시
      const marker = new kakao.maps.Marker({
        map: kakaoMap,
        position: coordinates,
        title: newItemList[0].name,
      });

      // 인포윈도우 생성 및 표시
      const iwContent = `<div style="padding:10px; font-weight:700;">${newItemList[0].name}</div>`;
      const infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
      });

      infowindow.open(kakaoMap, marker);
    }
  };

  const handleMapLocation = (e) => {
    e.preventDefault(); // 폼이 제출되는 것을 방지합니다.
    const targetId = e.currentTarget.getAttribute('data-id');

    // 검색 필터를 적용한 결과에서 선택된 항목을 찾습니다.
    const newItem = list.filter(
      (item) =>
        item.name.includes(searchValue) && parseInt(targetId) === item.id,
    );
    setMapList(newItem);

    // 지도를 선택한 위치로 이동
    drawMapWithList(newItem, 1);
  };

  // 검색어를 입력할 때마다 지도에 표시되는 데이터를 필터링하고 다시 그립니다.
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);

    const filteredList = list.filter((item) =>
      item.name.includes(e.target.value),
    );
    setMapList(filteredList);
    drawMapWithList(filteredList, 1);
  };

  //  페이지 클릭 이벤트: 사용자가 새 페이지를 선택할 때 실행되는 함수 추가
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * perPage;
  const pagedContents = list
    .filter((el) => el.name.includes(searchValue))
    .slice(offset, offset + perPage);

  const totalPages = Math.ceil(
    list.filter((el) => el.name.includes(searchValue)).length / perPage,
  );

  return (
    <>
      <TopFollowNav />
      {!loading && (
        <S.Map>
          <PreschoolMap list={mapList} />
          {list && allList && (
            <S.ListContainer>
              <h2 className="a11y-hidden">STORE</h2>
              <S.SearchContainer>
                <p className="title">매장 검색</p>
                <form onSubmit={handleMapLocation}>
                  <input
                    type="text"
                    placeholder="매장명을 입력해주세요."
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                  <button type="button">버튼</button>
                </form>
              </S.SearchContainer>
              {pagedContents.map((el) => {
                return (
                  <PreschoolList
                    key={el.id}
                    id={el.id}
                    name={el.name}
                    address={el.address}
                    tel={el.tel}
                    handleMapLocation={handleMapLocation}
                  />
                );
              })}

              {/* <S.Pagination>
                <S.ReactPaginate
                  previousLabel={
                    <img
                      src={prevIcon}
                      style={{
                        width: '10px',
                        marginRight: '15px',
                        cursor: 'pointer',
                      }}
                    />
                  }
                  nextLabel={
                    <img
                      src={nextIcon}
                      style={{
                        width: '10px',
                        marginLeft: '15px',
                        cursor: 'pointer',
                      }}
                    />
                  }
                  pageRangeDisplayed={10}
                  pageCount={Math.ceil(
                    list.filter((el) => el.name.includes(searchValue)).length /
                      perPage,
                  )}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  forcePage={currentPage}
                />
              </S.Pagination> */}
              <S.Pagination>
                {Array.from(Array(totalPages)).map((_, i) => (
                  <S.PaginationNumber
                    onClick={() => handlePageClick(i)}
                    key={i}
                  >
                    {i + 1}
                  </S.PaginationNumber>
                ))}
              </S.Pagination>
            </S.ListContainer>
          )}
        </S.Map>
      )}
      <TabMenu />
    </>
  );
};

export default Map;
