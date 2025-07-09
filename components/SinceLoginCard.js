import styles from '../styles/SinceLoginCard.module.css';

export default function SinceLoginCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recommended Actions</h3>
        <div className={styles.agentsIndicator}>
          <div className={styles.overlappingAvatars}>
            <div className={`${styles.miniAvatar} ${styles.avatarBlue}`}>
              <span className={styles.miniAvatarLetter}>M</span>
            </div>
            <div className={`${styles.miniAvatar} ${styles.avatarRed}`}>
              <span className={styles.miniAvatarLetter}>F</span>
            </div>
            <div className={`${styles.miniAvatar} ${styles.avatarGreen}`}>
              <span className={styles.miniAvatarLetter}>R</span>
            </div>
            <div className={`${styles.miniAvatar} ${styles.avatarOrange}`}>
              <span className={styles.miniAvatarLetter}>C</span>
            </div>
          </div>
          <span className={styles.agentsText}>4 agents working</span>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.listItem}>
          <div className={`${styles.statusDot} ${styles.dotRed} ${styles.pulse}`}></div>
          <div className={styles.taskContent}>
            <div className={styles.taskTitle}>Review 4 high-risk transactions</div>
          </div>
          <button className={styles.actionButton}>Review</button>
        </div>
        <div className={styles.listItem}>
          <div className={`${styles.statusDot} ${styles.dotRed} ${styles.pulse}`}></div>
          <div className={styles.taskContent}>
            <div className={styles.taskTitle}>Review 3 dispute resolutions</div>
          </div>
          <button className={styles.actionButton}>Respond</button>
        </div>
        <div className={styles.listItem}>
          <div className={`${styles.statusDot} ${styles.dotOrange}`}></div>
          <div className={styles.taskContent}>
            <div className={styles.taskTitle}>Approve 15% price increase for Premium tier</div>
          </div>
          <button className={styles.actionButton}>Review</button>
        </div>
        <div className={styles.listItem}>
          <div className={`${styles.statusDot} ${styles.dotOrange}`}></div>
          <div className={styles.taskContent}>
            <div className={styles.taskTitle}>Update checkout flow to reduce 23% cart abandonment</div>
          </div>
          <button className={styles.actionButton}>Update</button>
        </div>
        <div className={styles.listItem}>
          <div className={`${styles.statusDot} ${styles.dotGreen}`}></div>
          <div className={styles.taskContent}>
            <div className={styles.taskTitle}>12 disputes have been automatically resolved</div>
          </div>
          <button className={styles.actionButton}>View Details</button>
        </div>
        <div className={styles.viewMoreContainer}>
          <a href="#" className={styles.viewMoreLink}>View more</a>
        </div>
      </div>
    </div>
  );
} 