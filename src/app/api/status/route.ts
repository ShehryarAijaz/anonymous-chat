import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function GET(request: Request) {
    const routesToCheck = [
        '/dashboard',
        '/sign-in',
        '/sign-up',
        '/u/[username]',
    ]

    const protocol = request.headers.get("x-forwarded-proto");
    const host = request.headers.get("host");
    const baseUrl = `${protocol}://${host}`

    const results = []
    let overallStatus = 'OK'

    for (const route of routesToCheck) {
        let status = 'UP'
        let message = 'Route is accessible'

        try {
            const url = route.includes('[')
            ? baseUrl + route.replace('[username]', 'abcde')
            : baseUrl + route

            const response = await fetch(url)

            console.log(response)

            if (!response.ok) {
                status = 'DOWN';
                message = `HTTP Status: ${response.status} ${response.statusText}`;
                overallStatus = 'DEGRADED';
            }

        } catch (error: any) {
            status = 'DOWN';
            message = `Fetch error: ${error.message}`;
            overallStatus = 'DEGRADED';
        }

        results.push([{
            route,
            status,
            message
        }])
    }

    return Response.json(
        {
            success: overallStatus === 'OK',
            overallStatus: overallStatus,
            results: results
        },
        {
            status: overallStatus === 'OK' ? 200 : 503
        }
    )
}