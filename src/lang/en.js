export default {
  lastPage: 'Previous',
  nextPage: 'Next',
  'home.from': 'from',
  'mysolution.Approved': 'Approved',
  'mylikes.Bounties': 'Bounties',
  'userinfo.rewardsExplain': 'FansCoin (FC) is a smart contract designed and used on the Conflux network',
  'userInfo.viewMore': 'View More',
  get 'faq.index'() {
    return import('./faq_en.md');
  },
  get 'bounty.faq'() {
    return import('./bounty.faq_en.md');
  },
  'bounty.faq.private':
    'Suggestion: Up to 20 people can receive, each person (registered and completed at least one task) can receive 10FC award, each account hard top 120FC (later adjustable) \nTelegram: xxxxx',
  'submission.example':
    'By attracting fans to sign up for Conflux Bounty through microblog publicity, it is expected to generate 1,000 new registered users.',
  'My.Created Bounty': 'My Creation',
  'My.Involved Bounty': 'My Participation',
  'viewbounty.COMMENT': 'COMMENT',
  'head.switchTips':
    'After switching the national station, it will jump to the home page of the national station. The National Station contains a reward mission suitable for the country/region',
  'submission.note.AUDITING': 'AUDITING',
  'submission.note.DELETED': 'REJECTED',
  'submission.note.APPROVED': ' ',
  PermissionError: 'You do not have permission to access the page, please login again',
  'checkin.Unavailable': 'Unavailable',
  'bindacc.BACK': 'BACK',
  'bindacc.DONE': 'DONE',
  'bindacc.None': 'NONE',
  'bindacc.BIND': 'BIND',
  'bindacc.UNBIND': 'UNBIND',
  'withdraw.limit':
    "The DEX solution is on its beta version. In order to ensure the safety of the users' assets and avoid any loss caused by sudden restarts or troubleshooting of the DEX, the upper weekly withdrwal limit for each user is 5000 FC",
  'withdraw.address': 'Please enter a Conflux address starting with 0x',
  'Address Conversion Tip': 'For more information please visit',
  'Address Conversion': 'Address Conversion',
  withdrawNotice:
    'If you have any questions about Bounty withdrawal, please send detailed emails to <a rel="noopener noreferrer" target="_blank" href="mailto:bounty@confluxnetwork.org">bounty@confluxnetwork.org</a>, we will give you priority. Due to the old system, this system will no longer be updated and will only remain accessible.',
};
