import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gilroy = localFont({
	src: "../public/fonts/Gilroy-ExtraBold.ttf",
	variable: "--font-gilroy",
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
		<html lang="en" className={`${gilroy.variable} font-sans`}>
			<body className={gilroy.className}>{children}</body>
		</html>
	);
}
