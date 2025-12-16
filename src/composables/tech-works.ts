export async function useTechWorks() {
	const { $api } = useNuxtApp();
	const techworks = await $api.getMaintenance();

	if (!techworks?.start && !techworks?.end) {
		return false;
	}

	const now = Date.now();

	const endTime = techworks?.end
		? new Date(techworks.end).getTime()
		: new Date('2100-12-30').getTime();
	const startTime = techworks?.start
		? new Date(techworks.start).getTime()
		: new Date('1990-12-30').getTime();

	return now >= startTime && now <= endTime;
}
