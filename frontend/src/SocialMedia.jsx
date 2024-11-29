import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import './SocialMedia.css';  // Import external CSS

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);


const SocialMedia = () => {
  const [location, setLocation] = useState("");
  const [pollutionExperience, setPollutionExperience] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [duration, setDuration] = useState("");
  const [pollutionSource, setPollutionSource] = useState("");
  const [aggregateData, setAggregateData] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // To manage current set of 3 news articles

  const cityOptions = [
    "Delhi",
    "Ghaziabad",
    "Faridabad",
    "Gurgaon",
    "Noida",
    "Greater Noida",
    "YEIDA",
  ];

  // Fetch aggregate data from the backend
  const fetchAggregateData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/pollution/aggregate",
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Aggregate Data:", data); // Debugging log
        setAggregateData(data);
      } else {
        console.error("Error fetching aggregate data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching aggregate data:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/pollution/feedbacks");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Feedbacks:", data); // Debugging log
        setFeedbacks(data);
      } else {
        console.error("Error fetching feedbacks:", response.status);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Fetch news data
  const fetchNews = async () => {
    try {
      const apiKey = "06ae1785f49a4d91a41654742df40235";
      console.log("API Key:", apiKey); // Fetch from the environment variable
      if (!apiKey) {
        console.error("API key is missing!");
        return;
      }

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=pollution+delhi&sources=the-times-of-india&apiKey=${apiKey}`,
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched News Data:", data); // Debugging log
        setNewsData(data.articles);
      } else {
        console.error("Error fetching news:", response.status);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchAggregateData();
    fetchFeedbacks();
    fetchNews(); // Fetch news articles on initial load
  }, []);

  // Handle city selection change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setLocation(selectedCity);
    fetchAggregateData(); // Fetch aggregate data immediately when city is selected
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      location,
      pollutionExperience,
      symptoms,
      duration,
      pollutionSource,
      feedbackMessage,
    };

    try {
      const response = await fetch("http://localhost:3001/api/pollution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Pollution report saved!");
        setLocation("");
        setPollutionExperience("");
        setSymptoms([]);
        setDuration("");
        setPollutionSource("");
        setFeedbackMessage("");
        fetchAggregateData(); // Refresh aggregate data after submission
        fetchFeedbacks(); // Refresh feedbacks after submission
      } else {
        alert("Error submitting report!");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (aggregateData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = aggregateData.map((item) => item._id);
    const pollutionData = aggregateData.map((item) => item.count);
    const avgPollutionExperience = aggregateData.map(
      (item) => item.avgPollutionExperience,
    );

     return {
    labels,
    datasets: [
      {
        label: "Pollution Reports",
        data: pollutionData,
        backgroundColor: "rgba(54, 162, 235, 0.4)",  // Lighter background color
        borderColor: "rgba(54, 162, 235, 1)",  // Darker border
        borderWidth: 2,  // Slightly thicker border for better visibility
        hoverBackgroundColor: "rgba(54, 162, 235, 0.6)", // Slightly darker on hover
        hoverBorderColor: "rgba(54, 162, 235, 1)", // Darker border on hover
        hoverBorderWidth: 2, // Add a thicker border on hover for a professional look
      },
      {
        label: "Average Pollution Experience",
        data: avgPollutionExperience,
        backgroundColor: "rgba(255, 99, 132, 0.4)", // Softer color with less opacity
        borderColor: "rgba(255, 99, 132, 1)", // Darker border
        borderWidth: 2, // Slightly thicker border
        hoverBackgroundColor: "rgba(255, 99, 132, 0.6)", // Hover effect
        hoverBorderColor: "rgba(255, 99, 132, 1)", // Hover effect
        hoverBorderWidth: 2,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,  // Allow the chart to resize depending on the container
      plugins: {
        legend: {
          position: "top",  // Move the legend to the top for a clean layout
          labels: {
            font: {
              size: 14,  // Font size for legend labels
              family: "Arial, sans-serif",
            },
            color: "#555",  // Darker text color for better contrast
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",  // Darker tooltip background
          titleFont: {
            size: 16,  // Font size for the tooltip title
          },
          bodyFont: {
            size: 14,  // Font size for the tooltip body
          },
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Custom tooltip label format
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "#ddd",  // Lighter gridlines for the x-axis
            borderColor: "#ccc",  // Lighter border for the x-axis
            borderWidth: 1,
          },
          ticks: {
            font: {
              size: 12,  // Smaller font size for x-axis labels
            },
            color: "#555",  // Darker tick color for better contrast
          },
        },
        y: {
          grid: {
            color: "#ddd",  // Lighter gridlines for the y-axis
            borderColor: "#ccc",  // Lighter border for the y-axis
            borderWidth: 1,
          },
          ticks: {
            font: {
              size: 12,  // Smaller font size for y-axis labels
            },
            color: "#555",  // Darker tick color for better contrast
          },
        },
      },
    },
  };
};

  // Function to slide to the next set of news
  const handleNext = () => {
    if (currentIndex + 3 < newsData.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  // Function to slide to the previous set of news
  const handlePrev = () => {
    if (currentIndex - 3 >= 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  return (
    <div id="social-container">
        <div id="socialform-header"><div id="head-social">Share Your Pollution Experience</div>
        <div id="social-text">Help us understand the impact of air pollution in your area.Your feedback will  contribute to building a healthier future.</div></div>
        <div id="head-end">-vayudrishti</div>
    <div id="form-news">
        <div id="magcha-form-cha-div">
        <form id="social-form" onSubmit={handleSubmit}>
            <div id="Q1-form">
            <div>1. Location: </div>
            <select id="social-button-1" value={location} onChange={handleCityChange} required>
      <option value="">Select a City</option>
      {cityOptions.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </select>
            </div>
            <div id="Q2-form">
        <div>2. Pollution Experience :</div>
        <div className="button-group">
          <button 
            id="social-button"
            type="button"
            className={pollutionExperience === 'Good' ? 'selected' : ''}
            onClick={() => setPollutionExperience('Good')}
          >
            Good
          </button>
          <button
            id="social-button"
            type="button"
            className={pollutionExperience === 'Moderate' ? 'selected' : ''}
            onClick={() => setPollutionExperience('Moderate')}
          >
            Moderate
          </button>
          <button
            id="social-button"
            type="button"
            className={pollutionExperience === 'Poor' ? 'selected' : ''}
            onClick={() => setPollutionExperience('Poor')}
          >
            Poor
          </button>
          <button
            id="social-button"
            type="button"
            className={pollutionExperience === 'Very Poor' ? 'selected' : ''}
            onClick={() => setPollutionExperience('Very Poor')}
          >
            Very Poor
          </button>
          <button
            id="social-button"
            type="button"
            className={pollutionExperience === 'Severe' ? 'selected' : ''}
            onClick={() => setPollutionExperience('Severe')}
          >
            Severe
          </button>
        </div>
      </div>

        <div id="Q3-form">
       3. Symptoms:
<div className="button-group">
  {[
    "Breathing Difficulty",
    "Eye Irritation",
    "Coughing",
    "Fatigue",
    "No Symptoms",
  ].map((symptom) => (
    <button
    id="social-button"
      key={symptom}
      type="button"
      className={symptoms.includes(symptom) ? 'selected' : ''}
      onClick={() => {
        if (symptoms.includes(symptom)) {
          setSymptoms(prev => prev.filter(s => s !== symptom)); // Remove symptom if already selected
        } else {
          setSymptoms(prev => [...prev, symptom]); // Add symptom if not selected
        }
      }}
    >
      {symptom}
    </button>
  ))}
</div>

        </div>

        <div id="Q4-form">
        4. Duration of Exposure:
<div className="button-group">
  {[
    "< 1 Hour",
    "1-3 Hours",
    "> 3 Hours",
  ].map((durationOption) => (
    <button
    id="social-button"
      key={durationOption}
      type="button"
      className={duration === durationOption ? 'selected' : ''}
      onClick={() => setDuration(durationOption)}
    >
      {durationOption}
    </button>
  ))}
</div>

        </div>

        <div id="Q5-form">
       5. Pollution Source:
<div className="button-group">
  {[
    "Vehicles",
    "Industries",
    "Construction",
    "Burning",
    "Others",
  ].map((source) => (
    <button
    id="social-button"
      key={source}
      type="button"
      className={pollutionSource === source ? 'selected' : ''}
      onClick={() => setPollutionSource(source)}
    >
      {source}
    </button>
  ))}
</div>

        </div>


        <div id="Q6-form">
       6. Feedback:
    <textarea
      value={feedbackMessage}
      onChange={(e) => setFeedbackMessage(e.target.value)}
      placeholder="Leave your feedback"
    />
        </div>

        <button id="social-analytics-submit" type="submit">Submit Report</button>
            </form>
        </div>


        <div id="social-news">

        <div className="news-section">
  <div id="news-head">Latest Pollution News</div>
  {newsData.slice(currentIndex, currentIndex + 3).map((article, index) => (
  <div key={index} className="news-item" style={{ display: "flex", marginBottom: "20px" }}>
    {/* Image Section */}
    {article.urlToImage && (
      <div style={{ flex: "0 0 auto", width: "30%", marginRight: "20px" }}>
        <img
          src={article.urlToImage}
          alt={article.title}
          style={{
            width: "100%", // Make the image fill the container
            height: "auto", // Maintain the aspect ratio of the image
            borderRadius: "5px", // Optional, to round the image corners
          }}
        />
      </div>
    )}
    
    {/* Text Section */}
    <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
      <h4 style={{ fontSize: "1.2em", fontWeight: "bold" }}>{article.title}</h4>
      <p>{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF", textDecoration: "none" }}>
        Read more
      </a>
    </div>
  </div>
))}

  <div className="news-navigation">
    <button 
    id="prev-news-button"
    onClick={handlePrev} disabled={currentIndex === 0}>
      Previous
    </button>
    <button
        id="next-news-button"
      onClick={handleNext}
      disabled={currentIndex + 3 >= newsData.length}
    >
      Next
    </button>
  </div>
</div>


        </div>




    </div>

    <div id="social-analytice-graph">
    <div id="social-analytics-charts">
  <h2>Pollution Reports Analytics</h2>
  <Bar data={prepareChartData()} />
</div>

    </div>

    {feedbacks.map((feedback, index) => (
  <div key={index} className="feedback-box">
    <div className="feedback-header">
      <strong>Feedback #{index + 1}</strong>
      <span className="feedback-date">
        {new Date(feedback.timestamp).toLocaleString()}
      </span>
    </div>
    
    <div className="feedback-details">
      <p><strong>Location:</strong> {feedback.location}</p>
      <p><strong>Pollution Experience:</strong> {feedback.pollutionExperience}</p>
      <p><strong>Symptoms:</strong> {(feedback.symptoms ?? []).join(", ")}</p>
      <p><strong>Duration of Exposure:</strong> {feedback.duration}</p>
      <p><strong>Pollution Source:</strong> {feedback.pollutionSource}</p>
    </div>
    
    <div className="feedback-message">
      <strong>Feedback:</strong> <em>{feedback.feedbackMessage}</em>
    </div>
  </div>
))}



    
    
    
    </div>
  );
};

export default SocialMedia;






