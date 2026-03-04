"use server";

export async function getWeatherData() {
    try {
        // Gò Vấp, Ho Chi Minh City coordinates
        const lat = 10.8267;
        const lon = 106.6744;
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&timezone=Asia%2FBangkok`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        );
        const data = await response.json();

        return {
            current: data.current_weather.temperature,
            hourly: data.hourly.time.map((t: string, i: number) => ({
                time: new Date(t).getHours().toString().padStart(2, '0') + ':00',
                temp: data.hourly.temperature_2m[i]
            })).slice(0, 24) // Next 24 hours
        };
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        return { current: 27.5, hourly: [] };
    }
}
