export function parseVAST(vastXML) {
  // Use a DOMParser to parse the XML text
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(vastXML, "text/xml");

  // Extract media file URLs and their respective offsets
  const creatives = xmlDoc.querySelectorAll("Creative");
  const creativeDetails = Array.from(creatives).map((creative) => {
    const creativeId = creative.getAttribute("id");
    const linear = creative.querySelector("Linear");
    const offset = linear.querySelector("Offset")?.textContent.trim();
    const mediaFile = linear.querySelector("MediaFile");
    const mediaFileDetails = mediaFile
      ? {
          url: mediaFile.textContent.trim(),
          type: mediaFile.getAttribute("type"),
          bitrate: mediaFile.getAttribute("bitrate"),
          width: mediaFile.getAttribute("width"),
          height: mediaFile.getAttribute("height"),
        }
      : null;

    // Extract click-through URLs for each creative
    const clickThroughURL = linear
      .querySelector("VideoClicks ClickThrough")
      ?.textContent.trim();

    return { offset, mediaFileDetails, clickThroughURL, creativeId };
  });

  // Extract tracking URLs
  const trackingEvents = xmlDoc.querySelectorAll("Tracking");
  const trackingURLs = Array.from(trackingEvents).reduce((acc, track) => {
    const event = track.getAttribute("event");
    const url = track.textContent.trim();
    const offset = track.getAttribute("offset");

    if (
      !acc.some(
        (item) =>
          item.event === event && item.url === url && item.offset === offset
      )
    ) {
      acc.push({ event, url, offset });
    }

    return acc;
  }, []);

  return {
    creativeDetails,
    trackingURLs,
  };
}

export const vast4 = `
<VAST version="4.2" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="http://www.iab.com/VAST">
  <Ad id="20001" sequence="1">
    <InLine>
      <AdSystem version="1">iabtechlab</AdSystem>
      <Error><![CDATA[https://example.com/error]]></Error>
      <Extensions>
        <Extension type="iab-Count">
          <total_available>
            <![CDATA[ 2 ]]>
          </total_available>
        </Extension>
      </Extensions>
      <Impression id="Impression-ID"><![CDATA[https://example.com/track/impression]]></Impression>
      <Pricing model="cpm" currency="USD">
        <![CDATA[ 25.00 ]]>
      </Pricing>
      <AdServingId>a532d16d-4d7f-4440-bd29-2ec0e693fc80</AdServingId>
      <AdTitle>iabtechlab video ad</AdTitle>
      <Creatives>
        
        <!-- First Ad Creative at 15 seconds -->
        <Creative id="5480" sequence="1" adId="2447226">
          <Linear>
            <Duration>00:00:15</Duration>
            <Offset>00:00:15</Offset>
            <TrackingEvents>
              <Tracking event="start" ><![CDATA[https://example.com/tracking/start]]></Tracking>
              <Tracking event="progress" offset="00:00:10"><![CDATA[http://example.com/tracking/progress-10]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[https://example.com/tracking/firstQuartile]]></Tracking>
              <Tracking event="midpoint"><![CDATA[https://example.com/tracking/midpoint]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[https://example.com/tracking/thirdQuartile]]></Tracking>
              <Tracking event="complete"><![CDATA[https://example.com/tracking/complete]]></Tracking>
              <Tracking event="skipped"><![CDATA[https://example.com/tracking/skipped]]></Tracking>
            </TrackingEvents>
            <MediaFiles>
              <MediaFile id="5241" delivery="progressive" type="video/mp4" bitrate="2000" width="1280" height="546" minBitrate="1500" maxBitrate="2500" scalable="1" maintainAspectRatio="1" codec="H.264">
                <![CDATA[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4]]>
              </MediaFile>
            </MediaFiles>
            <VideoClicks>
              <ClickThrough id="blog">
                <![CDATA[https://store.google.com/us/product/chromecast_google_tv]]>
              </ClickThrough>
            </VideoClicks>
          </Linear>
          <UniversalAdId idRegistry="Ad-ID">8465</UniversalAdId>
        </Creative>

        <!-- Second Ad Creative at 7 minutes -->
        <Creative id="5481" sequence="2" adId="2447227">
          <Linear>
            <Duration>00:00:15</Duration>
            <Offset>00:07:00</Offset>
            <TrackingEvents>
              <Tracking event="start" ><![CDATA[https://example.com/tracking/start]]></Tracking>
              <Tracking event="progress" offset="00:00:10"><![CDATA[http://example.com/tracking/progress-10]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[https://example.com/tracking/firstQuartile]]></Tracking>
              <Tracking event="midpoint"><![CDATA[https://example.com/tracking/midpoint]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[https://example.com/tracking/thirdQuartile]]></Tracking>
              <Tracking event="complete"><![CDATA[https://example.com/tracking/complete]]></Tracking>
              <Tracking event="skipped"><![CDATA[https://example.com/tracking/skipped]]></Tracking>
              </TrackingEvents>
            <MediaFiles>
              <MediaFile id="5241" delivery="progressive" type="video/mp4" bitrate="2000" width="1280" height="546" minBitrate="1500" maxBitrate="2500" scalable="1" maintainAspectRatio="1" codec="H.264">
                <![CDATA[https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4]]>
              </MediaFile>
            </MediaFiles>
            <VideoClicks>
              <ClickThrough id="blog">
                <![CDATA[https://store.google.com/us/product/chromecast_google_tv]]>
              </ClickThrough>
            </VideoClicks>
          </Linear>
          <UniversalAdId idRegistry="Ad-ID">8466</UniversalAdId>
        </Creative>

        <!-- Third Ad Creative at 14 minutes -->
        <Creative id="5482" sequence="3" adId="2447228">
          <Linear>
            <Duration>00:00:15</Duration>
            <Offset>00:14:00</Offset>
            <TrackingEvents>
                <Tracking event="start" ><![CDATA[https://example.com/tracking/start]]></Tracking>
                <Tracking event="progress" offset="00:00:10"><![CDATA[http://example.com/tracking/progress-10]]></Tracking>
                <Tracking event="firstQuartile"><![CDATA[https://example.com/tracking/firstQuartile]]></Tracking>
                <Tracking event="midpoint"><![CDATA[https://example.com/tracking/midpoint]]></Tracking>
                <Tracking event="thirdQuartile"><![CDATA[https://example.com/tracking/thirdQuartile]]></Tracking>
                <Tracking event="complete"><![CDATA[https://example.com/tracking/complete]]></Tracking>
                <Tracking event="skipped"><![CDATA[https://example.com/tracking/skipped]]></Tracking>
              </TrackingEvents>
            <MediaFiles>
              <MediaFile id="5241" delivery="progressive" type="video/mp4" bitrate="2000" width="1280" height="546" minBitrate="1500" maxBitrate="2500" scalable="1" maintainAspectRatio="1" codec="H.264">
                <![CDATA[https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4]]>
              </MediaFile>
            </MediaFiles>
            <VideoClicks>
              <ClickThrough id="chromecast">
                <![CDATA[https://store.google.com/us/product/chromecast_google_tv]]>
              </ClickThrough>
            </VideoClicks>
          </Linear>
          <UniversalAdId idRegistry="Ad-ID">8467</UniversalAdId>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`;

export const videoToPlay = {
  url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  type: "video/mp4",
  bitrate: "2000",
  width: "1280",
  height: "546",
};

export const convertOffsetToSeconds = (offset) => {
  const [hours, minutes, seconds] = offset.split(":").map(parseFloat);
  return hours * 3600 + minutes * 60 + seconds;
};
