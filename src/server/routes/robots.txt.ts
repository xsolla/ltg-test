export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const robotsUrl = `${config.public.CDN_URL}/robots.txt`;
	const robotsContents = await fetch(robotsUrl);
	const robotsText = await robotsContents.text();
	event.node.res.setHeader('Content-Type', 'text/plain');
	return robotsText;
});
