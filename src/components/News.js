// components/News.js
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const News = () => {
  const [news, setNews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data) {
          setNews(data)
        } else {
          setNews([])
        }
      } catch (error) {
        console.error('Error fetching news data:', error.message)
      }
      };

    fetchNews();
  }, []);

    useEffect(() => {
        if (news.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === news.length - 1 ? 0 : prevIndex + 1
            );
        }, 7000);

        return () => clearInterval(interval);
    }, [news.length]);

  if (news.length === 0) {
    return <div>No news available.</div>;
  }

    return (
        <div className="news-container">
            <h2>Latest News</h2>
            <div className="news-scroll">
                {news.map((item, index) => (
                    <div
                        key={index}
                        className={`news-item ${index === currentIndex ? 'active' : ''}`}
                    >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <Image
                                src={item.image_url}
                                alt={item.title}
                                width={819}
                                height={460}
                                layout="responsive"
                                priority={index === 0}
                                loading={index !== 0 ? "lazy" : "eager"}
                            />
                        </a>
                        <p>{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default News
