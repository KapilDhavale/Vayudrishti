import React, { useEffect } from 'react';
import './Analytics.css'; // Optional: add styles as needed

const Analytics = () => {
  useEffect(() => {
    // Get the container div and object element
    const divElement = document.getElementById('tableauViz');
    const vizElement = divElement.getElementsByTagName('object')[0];
    
    // Adjust size based on container width
    if (divElement.offsetWidth > 800) {
      vizElement.style.width = '1000px';
      vizElement.style.height = '827px';
    } else if (divElement.offsetWidth > 500) {
      vizElement.style.width = '1000px';
      vizElement.style.height = '827px';
    } else {
      vizElement.style.width = '100%';
      vizElement.style.height = '1127px';
    }

    // Create and insert the Tableau JavaScript API script
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    vizElement.parentNode.insertBefore(scriptElement, vizElement);
  }, []);

  return (
    <div className="analytics-page">
      <div className="tableauPlaceholder" id="tableauViz" style={{ position: 'relative' }}>
        <noscript>
          <a href="#">
            <img 
              alt="AQI Data Dashboard" 
              src="https://public.tableau.com/static/images/AQ/AQIDashboard_17368117648480/mainDashboard/1_rss.png" 
              style={{ border: 'none' }} 
            />
          </a>
        </noscript>
        <object className="tableauViz" style={{ display: 'none' }}>
          <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
          <param name="embed_code_version" value="3" />
          <param name="site_root" value="" />
          <param name="name" value="AQIDashboard_17368117648480/mainDashboard" />
          <param name="tabs" value="no" />
          <param name="toolbar" value="yes" />
          <param name="static_image" value="https://public.tableau.com/static/images/AQ/AQIDashboard_17368117648480/mainDashboard/1.png" />
          <param name="animate_transition" value="yes" />
          <param name="display_static_image" value="yes" />
          <param name="display_spinner" value="yes" />
          <param name="display_overlay" value="yes" />
          <param name="display_count" value="yes" />
          <param name="language" value="en-US" />
          <param name="filter" value="publish=yes" />
        </object>
      </div>
    </div>
  );
};

export default Analytics;
    