import styles from '../styles/Trend.module.css';

function Trend({ data, onClick }) {
    return (
        <div className={styles.trend} onClick={onClick}>
            <p className={styles.trendContent}>{data.trendContent }</p>
            <p className={styles.trendCount}>{data?.hashtag_count || 0} tweets</p>
        </div>
    );
}

export default Trend;