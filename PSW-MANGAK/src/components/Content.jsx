// Content.jsx
import React from 'react';
import styles from './Content.module.css';

const Content = ({ mangaImage, title, author, rating, reviews, statusDot, publication }) => {
  return (
    <div className={styles.contentContainer}>
      <div className={styles.imageContainer}>
        <img src={mangaImage} alt={title} className={styles.image} />
      </div>
      <div className={styles.detailsContainer}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.author}>by {author}</p>
        <p className={styles.rating}>
          <span className={styles.statusDot}>{statusDot}</span> {rating} stars ({reviews} reviews)
        </p>
        <p className={styles.publication}>{publication}</p>
      </div>
    </div>
  );
};

export default Content;
