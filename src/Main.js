import React, { Component } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

import GithubAPI from './githubApi';

class Main extends Component {
  constructor(props) {
    super(props);
    const { localStorage } = window;
    const storageToken = localStorage.getItem('token') || '';
    const storageUserId = localStorage.getItem('userId') || '';

    this.state = {
      token: storageToken,
      userId: storageUserId,
      day: '',
      checklist: '',
      isLoading: false,
      isValidInput: false
    };
  }

  handleFormSubmit = async e => {
    e.preventDefault();
    const { token, userId, day, checklist } = this.state;

    this.setState({
      isLoading: true
    });

    try {
      const github = new GithubAPI(token, userId, day);
      await github.createIssues(checklist);
      localStorage.setItem('token', this.state.token);
      localStorage.setItem('userId', this.state.userId);
      this.props.history.push('/success');
    } catch (error) {
      console.error(error);
      alert('이슈 생성에 실패했습니다 ㅠ');
      this.setState({
        isLoading: false
      });
    }
  };

  handleCheckListLoad = async e => {
    e.preventDefault();
    const { token, userId, day } = this.state;
    const validateVar = [token, userId, day];
    const message = ['토큰을 입력해주세요.', '아이디를 입력해주세요.', '날짜를 입력해주세요'];
    const len = validateVar.length;
    for (let i = 0; i < len; i++) {
      if (!validateVar[i]) {
        alert(message[i]);
        return;
      }
    }

    if (!Number.isInteger(Number(day))) {
      alert('day는 숫자만 입력해주세요');
      return;
    }

    try {
      const github = new GithubAPI(token, userId, day);
      const data = await github.getCheckList();
      if (data === '') {
        alert(`day${day} readme는 아직 업데이트 되지 않았습니다.`);
        return;
      }
      this.setState({ checklist: data, isValidInput: true });
    } catch (error) {
      console.error(error);
      alert('체크리스트 가져오는데 실패했습니다.');
    }
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value
      },
      () => {
        value ? this.validateInput() : this.setState({ isValidInput: false });
      }
    );
  };

  validateInput = () => {
    const { token, userId, day, checklist } = this.state;
    const validateVar = [token, userId, day, checklist];

    const len = validateVar.length;
    for (let i = 0; i < len; i++) {
      if (!validateVar[i]) {
        this.setState({ isValidInput: false });
        return;
      }
    }
    this.setState({ isValidInput: true });
  };

  render() {
    const { handleChange, handleFormSubmit, handleCheckListLoad } = this;
    const { userId, token, isLoading, isValidInput, checklist } = this.state;
    let submitBtn;
    if (isValidInput) {
      submitBtn = <Submit type="submit" disabled={isLoading} value={isLoading ? '생성 중...' : '생성하기'} />;
    } else {
      submitBtn = <CustomText> 입력값을 전부 입력해주세요 </CustomText>;
    }
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
                      <input
                        type="text"
                        name="token"
                        value={token}
                        onChange={handleChange}
                        placeholder="e.g.) bc5fb251e649cf21aa22f03a0894a94cfde4923"
                      />
                    </label>
                  </Item>
                  <Item>
                    <label>
                      Github 아이디
                      <input
                        type="text"
                        name="userId"
                        value={userId}
                        onChange={handleChange}
                        placeholder="e.g.) myAwesomeGithubId"
                      />
                    </label>
                  </Item>
                  <Item>
                    <label>
                      미션 day
                      <input type="text" name="day" onChange={handleChange} placeholder="e.g.) 12" />
                    </label>
                  </Item>
                  <Item>
                    <label>
                      Checklist(마크다운형식)
                      <textarea
                        type="text"
                        name="checklist"
                        value={checklist}
                        onChange={handleChange}
                        placeholder={checklistPlaceholder}
                      />
                    </label>
                    <button onClick={handleCheckListLoad}>체크리스트 가져오기</button>
                  </Item>
                  {submitBtn}
                </Form>
              </Content>
            </Grid>
            <Grid item xs={0} md={3} />
          </Grid>
        </Container>
      </Wrapper>
    );
  }
}

const checklistPlaceholder = `e.g.)
1. [] 항목 1
2. [] 항목 2`;

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
  position: relative;

  button {
    position: absolute;
    top: -10px;
    right: 0px;
    width: 180px;
    background: #656aef;
    line-height: 30px;
    border-radius: 5px;
    border: none;
    color: white;
    font-size: 18px;
    font-weight: 700;
    display: block;
    margin: 0 auto;
    cursor: pointer;
  }

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

const CustomText = styled.text`
  height: 50px;
  width: 300px;
  text-align: center;
  color: black;
  background: none;
  line-height: 50px;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 700;
  display: block;
  margin: 0 auto;
`;

export default Main;
