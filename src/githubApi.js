import axios from 'axios';
class GithubAPI {
  constructor(token, userId, day) {
    this.github = axios.create({
      baseURL: `https://api.github.com/repos/${userId}/day${day}-challenge`,
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.symmetra-preview+json; charset=utf-8'
      }
    });
    this.githubConnect = axios.create({
      baseURL: `https://api.github.com/repos/connect-foundation/day${day}-challenge`,
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.symmetra-preview+json; charset=utf-8'
      }
    });
  }
  // public
  async createIssues(str) {
    const strArr = this._preProcessing(str);
    const dataArr = this._createJsonForm(strArr);
    await this._findOrCreate();
    await this._hasIssue();
    await this._createIssues(dataArr);
  }

  _preProcessing(str) {
    str = str.trim();
    const strArr = str
      .split(/\r?\n/)
      .filter(e => e)
      .map(e => e.trim());
    return strArr;
  }

  _createJsonForm(titles) {
    const arr = [];
    for (const title of titles) {
      const form = { title, body: '' };
      arr.push(form);
    }
    return arr;
  }

  async _hasIssue() {
    const result = await this.github.get('');
    const hasIssues = result.data.has_issues;
    if (!hasIssues) {
      console.log('current has_issue false.. request has_issue : true');
      await this.github.patch('', { has_issues: true });
      console.log('update has_issue : true');
    }
  }

  async _createIssues(datas) {
    console.log('request create issue');
    for (const data of datas) {
      const result = await this.github.post('/issues', data);
      const { created_at, title } = result.data;
      console.log(`생성시간 : ${created_at}, 제목 : ${title}`);
    }
    console.log('finished create issue');
  }

  /**
   * @returns {Array} String Array
   */
  async getCheckList() {
    const { githubConnect, _preProcessing, _findCheckList } = this;
    const readme = await githubConnect.get('/readme');
    const content = readme.data.content;
    const encodedContent = Buffer.from(content, 'base64').toString('utf8');
    const contentArr = _preProcessing(encodedContent);
    return _findCheckList(contentArr);
  }

  _findCheckList(contentArr) {
    const len = contentArr.length;

    const checkListArr = [];
    let checkPointIdx = 0;
    for (let i = len - 1; 0 <= i; i--) {
      if (contentArr[i].includes('체크포인트') || contentArr[i].includes('체크 포인트')) {
        checkPointIdx = i;
        break;
      }
    }

    for (let i = checkPointIdx + 2; i < len; i++) {
      const expectedNumber = Number(contentArr[i][0]);
      if (!Number.isInteger(expectedNumber)) {
        break;
      }
      checkListArr.push(contentArr[i]);
    }

    return checkListArr.join('\n');
  }

  async _fork() {
    const { githubConnect } = this;
    await githubConnect.post('/forks');
  }

  async _findOrCreate() {
    const { github } = this;

    console.log('레파지토리 있는지 확인..');
    try {
      await github.head('');
      console.log('레파지토리가 있습니다.');
    } catch (e) {
      console.log('레파지토리가 없습니다.. fork요청중...');
      await this._fork();
      console.log('fork 성공');
    }
  }
}

export default GithubAPI;
