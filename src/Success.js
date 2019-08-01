import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const Success = props => {
  return (
    <Wrapper>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={0} md={3} />
          <Grid item xs={12} md={6}>
            <Content>
              <Alert>이슈가 성공적으로 등록되었습니다!</Alert>
              <Link to="/">
                <Back>돌아가기</Back>
              </Link>
            </Content>
          </Grid>
          <Grid item xs={0} md={3} />
        </Grid>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  background: #f9f9f9;
`;

const Container = styled.div`
  max-width: 1004px;
  margin: 0 auto;
`;

const Content = styled.div`
  margin-top: 50px;
  background: white;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.13);
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Alert = styled.div`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
`;

const Back = styled.button`
  height: 50px;
  width: 110px;
  background: #656aef;
  line-height: 50px;
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: 700;
  display: block;
  margin: 0 auto;
  cursor: pointer;
`;

export default Success;
