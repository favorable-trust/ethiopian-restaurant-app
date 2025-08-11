// src/app/page.jsx
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import heroImage from '@/images/homepage_image.jpg';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-white">
        <Image
          src={heroImage}
          alt="Authentic Ethiopian cuisine from Mereb Restaurant"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 brightness-50"
          priority
          placeholder="blur"
        />
        <div className="z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
            Mereb Restaurant & Lounge
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">
            A culinary journey to the heart of Ethiopia, right here in Washington, DC.
          </p>
          <Link href="/menu" className="mt-8 inline-block">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              View Our Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Restaurant Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Welcome to Our Table</h2>
            <p className="text-gray-700 mb-4">
              For years, our family has been sharing the rich traditions and vibrant tastes of Ethiopian cooking. Each dish is prepared with love, using time-honored recipes and the freshest ingredients. Join us for a memorable dining experience that feels like coming home.
            </p>
            <p className="text-gray-700">
              Whether it's your first time trying injera or you're a connoisseur of doro wat, we have something to delight your palate.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <h3 className="text-2xl font-semibold mb-4 text-center">Visit Us</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Location</h4>
                <p>5215 Georgia Ave NW, Washington, DC 20011</p>
              </div>

              {/* --- Updated Hours Section --- */}
              <div>
                <h4 className="font-bold">Hours of Operation</h4>
                <p>Sunday - Saturday: 8:00 AM - 4:00 AM</p>
              </div>
              <div>
                <h4 className="font-bold">Alcohol Service</h4>
                <p>Sun - Thu: 10:00 AM - 2:00 AM</p>
                <p>Fri & Sat: 10:00 AM - 3:00 AM</p>
              </div>
              <div>
                <h4 className="font-bold">Live Entertainment</h4>
                <p>Sun - Thu: 5:00 PM - 2:00 AM</p>
                <p>Fri & Sat: 5:00 PM - 3:00 AM</p>
              </div>
              {/* --- End Updated Hours Section --- */}

              <div>
                <h4 className="font-bold">Contact</h4>
                <p>Phone: (Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}