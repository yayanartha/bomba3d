import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "700"],
	variable: "--font-roboto",
});

export const metadata: Metadata = {
	title: "Bomba 3D",
	description: "A pirate chaser game",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={roboto.variable}>
			<body className={roboto.className}>{children}</body>
		</html>
	);
}
