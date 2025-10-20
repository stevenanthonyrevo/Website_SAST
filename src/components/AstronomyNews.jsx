/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useMemo } from "react";
import "../index.css";
import { fetchAstronomyNews } from "../utils/astronomy-news";

const PAGE_SIZE = 9;

export default function AstronomyNews() {
  const seenIds = useRef(new Set());

  // Helper to fetch a page by pageParam (offset)
  const fetchPage = async ({ pageParam = 0 }) => {
    const res = await fetchAstronomyNews({
      limit: PAGE_SIZE,
      offset: pageParam,
    });
    if (res.error) throw new Error(res.error);
    return {
      articles: res.news,
      nextOffset: pageParam + res.news.length,
      total: res.total,
    };
  };

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useQuery(["astronomyNews"], fetchPage, {
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.articles.length < PAGE_SIZE) return undefined;
      return lastPage.nextOffset;
    },
    refetchInterval: 300 * 1000,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  // Flatten pages into a single array
  const pages = data?.pages || [];
  const flattened = useMemo(() => pages.flatMap((p) => p.articles), [pages]);

  useEffect(() => {
    if (!data) return;

    if (seenIds.current.size === 0) {
      flattened.forEach((a) => seenIds.current.add(a.id));
      return;
    }

    const latestPage = data.pages[0]?.articles || [];
    const newItems = latestPage.filter((a) => !seenIds.current.has(a.id));
    if (newItems.length > 0) {
      newItems.forEach((a) => seenIds.current.add(a.id));
    }
  }, [data, flattened]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = () => refetch();

  return (
    <>
      <div className="astronomy-news-container">
        <header className="astronomy-header">
          <h1 className="astronomy-title">Astronomy News</h1>
          <button
            className={`refresh-button ${isFetching ? "loading" : ""}`}
            onClick={handleRefresh}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Refresh"}
          </button>
        </header>

        {isFetching && flattened.length === 0 && (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">{error.message || String(error)}</p>
          </div>
        )}

        {!isFetching && !error && flattened.length === 0 && (
          <div className="empty-state">
            <p>No news articles found.</p>
          </div>
        )}

        {flattened.length > 0 && (
          <div className="news-grid">
            {flattened.map((item) => (
              <article
                key={item.id}
                className="news-card"
                onClick={() =>
                  window.open(item.url, "_blank", "noopener,noreferrer")
                }
              >
                <div className="news-image-container">
                  <img
                    src={item.image || "/vite.svg"}
                    alt={item.title}
                    className="news-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/vite.svg";
                    }}
                  />
                </div>

                <div className="news-content">
                  <h2 className="news-title">{item.title}</h2>
                  <p className="news-summary">{item.summary}</p>
                  {item.source && (
                    <div className="news-source">{item.source}</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="loading-more">
            <div className="spinner small"></div>
            <span>Loading more articles...</span>
          </div>
        )}

        {!hasNextPage && flattened.length > 0 && (
          <div className="end-message">
            <p>You've reached the end of the articles</p>
          </div>
        )}
      </div>
    </>
  );
}
