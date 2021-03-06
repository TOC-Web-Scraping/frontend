import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "../../hooks/usePlayers";
import Loader from "../../components/Loader/Loader";
import { Pagination } from "react-bootstrap";
import BackButton from "../../components/BackButton/BackButton";
import CardPlayer from "../../components/CardPlayer/CardPlayer";

function Players() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const {
    data: players,
    isLoading,
    error,
    isError,
  } = usePlayers(debouncedSearch);

  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  if (isError)
    return (
      <Container>
        <h1 style={{ color: "white" }}>Error : {error.message}</h1>
      </Container>
    );

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < players?.length / 8) {
      setCurrentPage(currentPage + 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(players?.length / 8); i++) {
    pageNumbers.push(i);
  }
  const paginationElements = pageNumbers
    .filter((number) => {
      if (currentPage < 3) {
        return number <= 5;
      } else if (currentPage > pageNumbers.length - 3) {
        return number >= pageNumbers.length - 4;
      }
      return number >= currentPage - 2 && number <= currentPage + 2;
    })
    .map((number) => {
      return (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    });

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onCardClick = (id) => {
    if (id) {
      navigate(`/player/${id}`);
    }
  };

  return (
    <div>
      <Container>
        <BackButton handleBackClick={() => navigate("/")} />
        <SearchBox>
          <AiOutlineSearch size={30} />
          <SearchInput
            type="text"
            placeholder="Search"
            value={search}
            onChange={onSearchChange}
          />
        </SearchBox>
        <PlayerText>Players</PlayerText>
        {isLoading && <Loader />}
        <CardContainer>
          {players
            ?.filter((_, index) => {
              return index >= 8 * (currentPage - 1) && index < 8 * currentPage;
            })
            .map((player) => {
              return (
                <div
                  className="card"
                  key={player.name}
                  onClick={() => onCardClick(player.url)}
                >
                  <CardPlayer player={player} />
                </div>
              );
            })}
        </CardContainer>
        {players?.length > 8 && (
          <StyledPagination>
            <Pagination.Prev onClick={handlePrev} />
            {paginationElements}
            <Pagination.Next onClick={handleNext} />
          </StyledPagination>
        )}
      </Container>
    </div>
  );
}

const Container = styled.div`
  margin: 40px auto;
  max-width: 1200px;
  width: 90%;
  position: relative;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  column-gap: 5px;
  color: #ffffff87;
`;

const SearchInput = styled.input`
  width: 230px;
  height: 30px;
  background-color: #323949;
  border-radius: 3px;
  border: #323949;
  outline: none;
  color: #ffffff;
  padding: 10px;

  &::placeholder {
    color: #fff;
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  margin-top: 30px;
  position: relative;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }

  .card {
    border-radius: 10px;
    height: 320px;
    cursor: pointer;
  }
`;

const PlayerText = styled.h1`
  position: absolute;
  top: 0;
  right: 10px;
  color: #fff;
  line-height: 0.8;
`;

const StyledPagination = styled(Pagination)`
  display: flex;
  margin-top: 20px;
  justify-content: center;

  .page-item.active .page-link {
    background-color: #323949;
    border-color: #323949;
  }

  .page-link {
    color: #000;
  }
`;

export default Players;
