import React, { useState } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

import GithubAPI from './githubApi';

const Main = props => {
  const [state, setState] = useState({
    token: '',
    userId: '',
    day: '',
    checklist: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async e => {
    try {
      e.preventDefault();
      const { token, userId, day, checklist } = state;

      if (!token) {
        alert('토큰을 입력해 주세요.');
        throw '';
      }

      if (!userId) {
        alert('Github 아이디를 입력해 주세요.');
        throw '';
      }

      if (!day) {
        alert('미션 day를 입력해 주세요.');
        throw '';
      }

      if (!checklist) {
        alert('Checklist를 입력해 주세요.');
        throw '';
      }

      setIsLoading(true);
      const github = new GithubAPI(token, userId, day);
      await github.createIssues(checklist);
      props.history.push('/success');
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  };

  return (
    <Wrapper>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={0} md={3} />
          <Grid item xs={12} md={6}>
            <Content>
              <Form onSubmit={handleFormSubmit}>
                <Title>
                  <span>👑</span>
                  이슈 생성기
                </Title>

                <Item>
                  <label>
                    토큰
                    <input type="text" name="token" onChange={handleChange} />
                  </label>
                </Item>
                <Item>
                  <label>
                    Github 아이디
                    <input type="text" name="userId" onChange={handleChange} />
                  </label>
                </Item>
                <Item>
                  <label>
                    미션 day
                    <input type="text" name="day" onChange={handleChange} />
                  </label>
                </Item>
                <Item>
                  <label>
                    Checklist(마크다운형식)
                    <textarea
                      type="text"
                      name="checklist"
                      onChange={handleChange}
                    />
                  </label>
                </Item>
                <Submit
                  type="submit"
                  disabled={isLoading}
                  value={isLoading ? '생성 중...' : '생성하기'}
                />
              </Form>
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
  padding: 30px 40px;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.13);
`;

const Form = styled.form``;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;

  span {
    display: block;
  }
`;

const Item = styled.div`
  margin-bottom: 20px;

  label {
    font-size: 16px;
    font-weight: 500;
    color: #555;

    input {
      display: block;
      width: 100%;
      height: 50px;
      border: 1px solid #eee;
      background: #fafafa;
      margin-top: 5px;
      font-size: 16px;
      font-weight: 400;
      padding: 0 15px;
    }

    textarea {
      display: block;
      width: 100%;
      resize: none;
      border: 1px solid #eee;
      background: #fafafa;
      margin-top: 5px;
      height: 200px;
      font-size: 16px;
      font-weight: 400;
      color: #555;
      padding: 15px;
    }
  }
`;

const Submit = styled.input`
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

export default Main;
