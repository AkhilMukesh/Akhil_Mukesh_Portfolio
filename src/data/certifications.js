/**
 * Certifications shown on the site and in the résumé.
 *
 * The Machine Learning Specialization is ONE credential covering three courses
 * (they share a single verify URL), so it's listed as one entry with the course
 * names in `detail` rather than split into separate rows.
 */
const certifications = [
  {
    title: 'Machine Learning Specialization',
    issuer: 'Stanford University & DeepLearning.AI',
    date: 'May 2026',
    detail:
      'Supervised Machine Learning: Regression and Classification · Advanced Learning Algorithms · Unsupervised Learning, Recommenders, Reinforcement Learning',
    credentialUrl:
      'https://www.coursera.org/account/accomplishments/specialization/6RVBAZDB5TMZ',
  },
];

export default certifications;
