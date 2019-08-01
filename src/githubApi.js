import axios from 'axios';

class GithubAPI {
  constructor(token, userId, day) {
    this.github = axios.create({
      baseURL: `https://api.github.com/repos/${userId}/day${day}-challenge`,
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.symmetra-preview+json'
      }
    });
  }
  // public
  async createIssues(str) {
    const strArr = this._preProcessing(str);
    const dataArr = this._createJsonForm(strArr);
    await this._hasIssue();
    await this._createIssues(dataArr);
  }
  _preProcessing(str) {
    str = str.trim();
    const strArr = str.split('\n').map(e => e.trim());
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
}

export default GithubAPI;
