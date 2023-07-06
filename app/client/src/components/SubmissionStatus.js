import React, { useEffect, useState } from 'react';
import '../assets/stylesheets/submissionStatus.css'


// function SubmissionStatus({ status }) {
  
//   if (status === 'success') {
//     return <div 
//         className="submission-status success"
//     >Message submitted successfully!</div>;
//   }
//   if (status === 'error') {
//     return <div 
//         className="submission-status error"
//     >An error occurred. Please try again later.</div>;
//   }
//   return null;
// }

// --------------------------------------------------------

// 6second delay until message disappears 

function SubmissionStatus({ status }) {
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    if (status) {
      setShowStatus(true);

      const timeout = setTimeout(() => {
        setShowStatus(false);
      }, 6000);

      return () => clearTimeout(timeout);
    }
  }, [status]);

  if (status === 'success' && showStatus) {
    return (
      <div className="submission-status success">
        Message submitted successfully!
      </div>
    );
  }
  if (status === 'error' && showStatus) {
    return (
      <div className="submission-status error">
        An error occurred. Please try again later.
      </div>
    );
  }
  return null;
}

export default SubmissionStatus;
