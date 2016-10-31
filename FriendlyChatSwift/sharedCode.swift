


import UIKit

extension NSDate
{
    func hour() -> Int
    {
        //Get Hour
        let calendar = NSCalendar.current
        let hour = calendar.component(.hour, from: self as Date)
        //Return Hour
        return hour
    }


    func minute() -> Int
    {
        //Get Minute
        let calendar = NSCalendar.current
        let minute = calendar.component(.minute, from: self as Date)
        //Return Minute
        return minute
    }
    func second() -> Int
    {
        //Get Minute
        let calendar = NSCalendar.current
        let second = calendar.component(.second, from: self as Date)
        //Return Second
        return second
    }


    func toShortTimeString() -> String
    {
        //Get Short Time String
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        let timeString = formatter.string(from: self as Date)

        //Return Short Time String
        return timeString
    }
}

