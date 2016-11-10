


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

extension Double{
    func NSDateHour() -> Int
    {
        let date = NSDate(timeIntervalSince1970: self as Double)
        return date.hour() - 19
    }
    func NSDateMinute() -> Int
    {
        let date = NSDate(timeIntervalSince1970: self as Double)
        return date.minute()
    }
    func NSDateSecond() -> Int
    {
        let date = NSDate(timeIntervalSince1970: self as Double)
        return date.second()
    }
    
    func toShortTimeString() -> String
    {
        //Get Short Time String
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        let date = NSDate(timeIntervalSince1970: self as Double)
        let timeString = formatter.string(from: date as Date)
        //Return Short Time String
        return timeString
    }

}

func formatTimeString(hrs : Int, mins : Int, sec : Int) -> String{
    let hoursString = hrs > 9 ? "\(hrs)" : "0\(hrs)"
    let minutesString = mins > 9 ? "\(mins)" : "0\(mins)"
    let secondsString = sec > 9 ? "\(sec)" : "0\(sec)"
    return "\(hoursString):\(minutesString):\(secondsString)"
}

func formatShortTimeString(hrs : Int, mins : Int) -> String{
    let hoursString = hrs > 9 ? "\(hrs)" : "0\(hrs)"
    let minutesString = mins > 9 ? "\(mins)" : "0\(mins)"
    return "\(hoursString):\(minutesString)"
}


