export default defineEventHandler(async (event) => {
  // Get the user's IP address from the request headers
  const clientIp = getRequestHeader(event, 'x-forwarded-for') ||
                   getRequestHeader(event, 'x-real-ip') ||
                   event.node.req.socket.remoteAddress ||
                   '';
  try {
    // Make a request to the Xsolla API with the user's IP
    const response = await fetch(`https://backoffice.ltg.com/api/geoip/json/${clientIp}?fields=countryCode`, {
      method: 'GET'
    });

    const result = await response.json();

    // Return the region or default to 'US' if there's an error
    if (result?.countryCode) {
      return { region: result.countryCode};
    }

    return { region: 'US'};
  } catch (error) {
    console.error('Error fetching geo IP:', error);
    return { region: 'US' };
  }
});
