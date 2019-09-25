export default {
  lastPage: 'Previous',
  nextPage: 'Next',
  'home.from': 'from',
  'mysolution.Approved': 'Approved',
  'mylikes.Bounties': 'Bounties',
  'userinfo.rewardsExplain': 'Fans Coin (FC) is a smart contract designed and used solely on the Conflux Testnet.',
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
};
