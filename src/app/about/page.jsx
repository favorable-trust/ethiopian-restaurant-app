// src/app/about/page.jsx
import Image from 'next/image'

// You'll want to replace these with actual photos from the restaurant
// Place them in your /src/images/ folder and import them like we did for the homepage.
import aboutImage1 from '@/images/placeholder-about1.jpg';
import aboutImage2 from '@/images/placeholder-about2.jpg';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Our Story</h1>
        
        <div className="text-lg text-gray-700 space-y-6">
          <p>
            Mereb Restaurant & Lounge was born from a dream to bring the authentic, vibrant soul of Ethiopian hospitality and cuisine to the heart of Washington, DC. Our name, 'Mereb', reflects the rivers that flow through Ethiopia, symbolizing the connection, community, and lifeblood of our culture—a spirit we aim to share with every guest who walks through our doors.
          </p>
          <p>
            Our journey began in our family's kitchen, where generations-old recipes were not just instructions, but stories passed down through time. We use the same spices, the same slow-cooking techniques, and the same dedication to freshness to create dishes that are both deeply traditional and wonderfully delicious. From the rich, complex stews (wats) to the spongy, tangy injera that accompanies them, every meal is an invitation to a shared experience.
          </p>
        </div>

        <div className="my-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-64 rounded-lg overflow-hidden">
                <Image 
                    src={aboutImage1} 
                    alt="Interior of Mereb Restaurant" 
                    fill 
                    style={{objectFit: 'cover'}}
                    placeholder="blur"
                />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
                <Image 
                    src={aboutImage2} 
                    alt="A traditional Ethiopian coffee ceremony" 
                    fill 
                    style={{objectFit: 'cover'}}
                    placeholder="blur"
                />
            </div>
        </div>

        <div className="text-lg text-gray-700 space-y-6">
            <p>
            But Mereb is more than just a place to eat; it's a lounge, a gathering spot, a place for community. We invite you to relax, enjoy our live entertainment, and partake in the timeless tradition of the coffee ceremony. We believe that food is a universal language, and we are honored to share our dialect with you.
            </p>
        </div>
      </div>
    </div>
  )
}