module.exports = {
    getCSPForDomain: (url) => {
      let csp = "default-src 'none';"; // Block all sources by default
  
      // Define CSP rules for specific domains
      if (url.includes('meet.google.com')) {
        csp = `
          default-src 'none';
          script-src 'self'  https://www.gstatic.com/ https://meet.google.com/;
          script-src-elem 'self'  https://www.gstatic.com/ https://meet.google.com/;
          connect-src 'self'  https://meet.google.com/;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/;
          img-src 'self' https://*.googleusercontent.com/;
          font-src 'self' https://fonts.gstatic.com/;
        `;
      } else if (url.includes('teams.microsoft.com')) {
        csp = `
          default-src 'none';
          script-src 'self'  https://statics.teams.cdn.office.net/;
          script-src-elem 'self'  https://statics.teams.cdn.office.net/;
          connect-src 'self'  https://teams.microsoft.com/;
          style-src 'self' 'unsafe-inline' https://statics.teams.cdn.office.net/;
          img-src 'self' https://*.teams.cdn.office.net/;
          font-src 'self' https://statics.teams.cdn.office.net/;
        `;
      } else if (url.includes('zoom.us')) {
        csp = `
          default-src 'none';
          script-src 'self'  https://zoom.us/;
          script-src-elem 'self'  https://zoom.us/;
          connect-src 'self'  https://zoom.us/;
          style-src 'self' 'unsafe-inline' https://zoom.us/;
          img-src 'self' https://zoom.us/;
          font-src 'self' https://zoom.us/;
        `;
      }
  
      return csp;
    },
  };