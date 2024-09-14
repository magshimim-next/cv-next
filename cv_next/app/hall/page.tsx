import React from 'react';

const contributors = [
  { name: 'Alice', contribution: 'Frontend Development' },
  { name: 'Bob', contribution: 'Backend Development' },
  { name: 'Charlie', contribution: 'UI/UX Design' },
  // Add more contributors as needed
];

const hall: React.FC = () => {
  const styles = {
    container: {
      textAlign: 'center' as const,
      padding: '20px',
    },
    title: {
      fontSize: '2.5em',
      marginBottom: '20px',
    },
    contributor: {
      listStyle: 'none',
      margin: '10px 0',
    },
    contributorName: {
      fontSize: '1.5em',
      margin: '0',
    },
    contributorContribution: {
      fontSize: '1em',
      color: '#555',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{contribu</h1>
      <ul>
        {contributors.map((contributor, index) => (
          <li key={index} style={styles.contributor}>
            <h2 style={styles.contributorName}>{contributor.name}</h2>
            <p style={styles.contributorContribution}>{contributor.contribution}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default hall;