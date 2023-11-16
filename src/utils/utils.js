export function parseVAST(vastXML) {
  // Use a DOMParser to parse the XML text
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(vastXML, "text/xml");

  // Extract media file URLs
  const mediaFiles = xmlDoc.querySelectorAll("MediaFile");
  const mediaFileURLs = Array.from(mediaFiles).map((media) => ({
    url: media.textContent.trim(),
    type: media.getAttribute("type"),
    bitrate: media.getAttribute("bitrate"),
    width: media.getAttribute("width"),
    height: media.getAttribute("height"),
  }));

  // Extract tracking URLs
  const trackingEvents = xmlDoc.querySelectorAll("Tracking");
  const trackingURLs = Array.from(trackingEvents).map((track) => ({
    event: track.getAttribute("event"),
    url: track.textContent.trim(),
    offset: track.getAttribute("offset"),
  }));

  // Extract click-through URL
  const clickThroughURL = xmlDoc
    .querySelector("ClickThrough")
    ?.textContent.trim();

  // Extract AdVerifications
  const adVerifications = xmlDoc.querySelectorAll(
    "AdVerifications > Verification"
  );
  const adVerificationURLs = Array.from(adVerifications).map(
    (verification) => ({
      vendor: verification.getAttribute("vendor"),
      javascriptResource: verification
        .querySelector("JavaScriptResource")
        ?.textContent.trim(),
      flashResource: verification
        .querySelector("FlashResource")
        ?.textContent.trim(),
      viewableImpression: verification
        .querySelector("ViewableImpression")
        ?.textContent.trim(),
    })
  );

  // Extract Category
  const categoryElements = xmlDoc.querySelectorAll("Category");
  const categories = Array.from(categoryElements).map((category) => ({
    authority: category.getAttribute("authority"),
    value: category.textContent.trim(),
  }));

  return {
    mediaFileURLs,
    trackingURLs,
    clickThroughURL,
    adVerificationURLs,
    categories,
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
        <Creative id="5480" sequence="1" adId="2447226">
          <Linear>
            <TrackingEvents>
              <Tracking event="start" ><![CDATA[https://example.com/tracking/start]]></Tracking>
              <Tracking event="progress" offset="00:00:10"><![CDATA[http://example.com/tracking/progress-10]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[https://example.com/tracking/firstQuartile]]></Tracking>
              <Tracking event="midpoint"><![CDATA[https://example.com/tracking/midpoint]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[https://example.com/tracking/thirdQuartile]]></Tracking>
              <Tracking event="complete"><![CDATA[https://example.com/tracking/complete]]></Tracking>
              <Tracking event="skipped"><![CDATA[https://example.com/tracking/skipped]]></Tracking>
              </TrackingEvents>
            <Duration>00:00:16</Duration>
            <MediaFiles>
              <MediaFile id="5241" delivery="progressive" type="video/mp4" bitrate="2000" width="1280" height="546" minBitrate="1500" maxBitrate="2500" scalable="1" maintainAspectRatio="1" codec="H.264">
                <![CDATA[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4]]>
              </MediaFile>
              <MediaFile id="5244" delivery="progressive" type="video/mp4" bitrate="2000" width="1280" height="546" minBitrate="1500" maxBitrate="2500" scalable="1" maintainAspectRatio="1" codec="H.264">
                <![CDATA[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4]]>
              </MediaFile>
              <MediaFile id="5246" delivery="progressive" type="video/mp4" bitrate="2000" width="1280" height="546" minBitrate="1500" maxBitrate="2500" scalable="1" maintainAspectRatio="1" codec="H.264">
                <![CDATA[https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4]]>
              </MediaFile>
            </MediaFiles>
            <VideoClicks>
              <ClickThrough id="blog">
                <![CDATA[https://iabtechlab.com]]>
              </ClickThrough>
            </VideoClicks>
          </Linear>
          <UniversalAdId idRegistry="Ad-ID">8465</UniversalAdId>
          <UniversalAdId idRegistry="Foo-ID">4444323</UniversalAdId>
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

export const calculateAdPlayTimes = (videoDuration, numberOfAds) => {
  if (numberOfAds === 0) return [];

  // Define times for the first and last ads
  const firstAdTime = 15; // 15 seconds for the first ad
  const lastAdTime = videoDuration - 45; // 45 seconds before the end for the last ad

  let adTimes = [];

  // First ad
  if (numberOfAds >= 1) {
    adTimes.push({ start: firstAdTime, end: firstAdTime + 1 });
  }

  // Middle ad(s)
  for (let i = 1; i < numberOfAds - 1; i++) {
    let middleAdTime = (videoDuration / (numberOfAds - 1)) * i;
    adTimes.push({ start: middleAdTime, end: middleAdTime + 1 });
  }

  // Last ad
  if (numberOfAds > 1) {
    adTimes.push({ start: lastAdTime, end: lastAdTime + 1 });
  }

  return adTimes;
};
