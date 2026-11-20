import { Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="h-5 w-5 text-[#15803d]" />
              <span className="font-extrabold text-[#15803d] text-base">RiceLink</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Multi-crop agricultural exchange connecting farmgate supply with food mills and industrial buyers across Nigeria.
            </p>
          </div>

          <div>
            <p className="font-bold text-gray-900 uppercase tracking-wider mb-2">Farmers & Co-ops</p>
            <ul className="space-y-1.5 text-gray-600 font-semibold">
              <li>
                <Link to="/supply?action=new" className="hover:text-[#15803d]">
                  + List Crops for Sale
                </Link>
              </li>
              <li>
                <Link to="/supply" className="hover:text-[#15803d]">
                  My Listed Produce
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-[#15803d]">
                  Find Buyer Matches
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-gray-900 uppercase tracking-wider mb-2">Processors & Buyers</p>
            <ul className="space-y-1.5 text-gray-600 font-semibold">
              <li>
                <Link to="/demand" className="hover:text-[#15803d]">
                  + Post Purchase Tender
                </Link>
              </li>
              <li>
                <Link to="/demand" className="hover:text-[#15803d]">
                  Browse Open Orders
                </Link>
              </li>
              <li>
                <Link to="/commodities" className="hover:text-[#15803d]">
                  Standard Bag Weights Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-gray-900 uppercase tracking-wider mb-2">Support & Platform</p>
            <ul className="space-y-1.5 text-gray-600 font-semibold">
              <li>
                <Link to="/inquiries" className="hover:text-[#15803d]">
                  Messages & Deal Desk
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#15803d]">
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#15803d]">
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} RiceLink Agricultural Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 font-semibold text-gray-600">
            <span>Kebbi</span>
            <span>•</span>
            <span>Kaduna</span>
            <span>•</span>
            <span>Kano</span>
            <span>•</span>
            <span>Oyo</span>
            <span>•</span>
            <span>Benue</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
