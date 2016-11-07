//
//  Copyright (c) 2015 Google Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
import Photos
import UIKit

import Firebase
import GoogleMobileAds

/**
 * AdMob ad unit IDs are not currently stored inside the google-services.plist file. Developers
 * using AdMob can store them as custom values in another plist, or simply use constants. Note that
 * these ad units are configured to return only test ads, and should not be used outside this sample.
 */
let kBannerAdUnitID = "ca-app-pub-3940256099942544/2934735716"

class timeStorage {
    var hours: Int
    var minutes: Int
    var seconds: Int
    
    init (hrs: Int, min: Int, sec: Int) {
        self.hours = hrs
        self.minutes = min
        self.seconds = sec
    }
    func updateTime(hrs: Int, min: Int, sec: Int) {
        self.hours = hrs
        self.minutes = min
        self.seconds = sec
    }
    func addTime(hrs: Int, min: Int, sec: Int) {
        self.hours += hrs
        self.minutes += min
        self.seconds += sec
        
        if self.seconds > 60{
            self.minutes += 1
            self.seconds -= 60
        }
        if self.minutes > 60{
            self.hours += 1
            self.minutes -= 60
        }
    }
}

extension UIViewController {
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboardView))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    func dismissKeyboardView() {
        view.endEditing(true)
    }
}

@objc(FCViewController)
class FCViewController: UIViewController, UITableViewDataSource, UITableViewDelegate,
UITextFieldDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate,
UIPickerViewDataSource, UIPickerViewDelegate {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.pickerView.dataSource = self;
        self.pickerView.delegate = self;
        pickerText.text = pickerData[0]

        mainClock.text = "00:00:00"
        countdown = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(FCViewController.updateCountdown), userInfo: nil, repeats: true)
        timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(FCViewController.updateForwardTimer), userInfo: nil, repeats: true)

        
        c_hours = 23 - currentDate.hour()
        c_minutes = 60 - currentDate.minute()
        c_seconds = 60 - currentDate.second()
        
        
        
        self.clientTable.register(UITableViewCell.self, forCellReuseIdentifier: "tableViewCell")
        
        configureDatabase()
        configureStorage()
        configureRemoteConfig()
        fetchConfig()
        //loadAd()
        logViewLoaded()
        
        self.hideKeyboardWhenTappedAround()
    }

    
    @IBOutlet weak var pickerView: UIPickerView!
    @IBOutlet weak var pickerText: UILabel!
    var curr_hour = 0, curr_min = 0, curr_sec = 0
    var secondsString = "", minutesString = "", hoursString = ""
    var old_idx = 0
    
    // PICKER VIEW------------------------------------------------------
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    let pickerData = ["Sleeping", "Traveling", "Studying", "Eating", "Socializing", "Grooming", "Exercising"]
    //MARK: Data Sources
    func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
        return 1//MARK: - Delegates and data sources
        
    }
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return pickerData.count
    }
    //MARK: Delegates
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return pickerData[row]
    }
    
    var pastActivity = 0.0
    var currActivity = 0.0
    var timeDelta = 0.0
    var startDate: NSDate = NSDate()
    
    // your long procedure
    
    var endDate: NSDate = NSDate()
    

    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        //Point of switching activities
        saveActivityData(idx: old_idx)
        pickerText.text = pickerData[row]
        setWatch(sec: storedTimes[row].seconds,
                 min: storedTimes[row].minutes,
                 hour: storedTimes[row].hours)
        currentDate = NSDate()
        print("current date: \(currentDate)")
        
        
        endDate = NSDate()

        //var interval = NSDate().timeIntervalSince1970
        let dateFormatter = DateFormatter()
        dateFormatter.timeZone = NSTimeZone(name: "EST") as TimeZone!

        currActivity = NSDate().timeIntervalSince1970
        timeDelta = currActivity - pastActivity

        var timeDeltaDate = NSDate(timeIntervalSince1970: timeDelta)
        print("prev time: \(pastActivity)")
        print("curr time : \(currActivity)")
        print("timedelta: \(timeDelta)")
        print("timedelta date: \(timeDeltaDate)")
        print("formatted: \(Date(timeIntervalSince1970: timeDelta))")
        print("timedelta hour: \(timeDeltaDate.hour())")
        print("timedelta min: \(timeDeltaDate.minute())")
        print("timedelta sec: \(timeDeltaDate.second())")
        print("\(dateFormatter.string(from: timeDeltaDate as Date))")
        
        let elapsed_hr = timeDeltaDate.hour() - 19
        let elapsed_min = timeDeltaDate.minute()
        let elapsed_sec = timeDeltaDate.second()
        print("timedelta hour: \(elapsed_hr)")
        print("timedelta min: \(elapsed_min)")
        print("timedelta sec: \(elapsed_sec)")

        
        
        startDate = endDate
        pastActivity = currActivity
//        print(interval)
//        print("\(interval)")
//        var dateTime = Date(timeIntervalSince1970: interval)
//        print(dateTime)
        
        
        
        curr_hour = currentDate.hour()
        curr_min = currentDate.minute()
        curr_sec = currentDate.second()
        
        minutesString = curr_min > 9 ? "\(curr_min)" : "0\(curr_min)"
        hoursString = curr_hour > 9 ? "\(curr_hour)" : "0\(curr_hour)"
        secondsString = curr_sec > 9 ? "\(curr_sec)" : "0\(curr_sec)"

        sendMessage(withData: [Constants.MessageFields.text: "\(pickerText.text!) @ \(hoursString):\(minutesString):\(secondsString)"])
        old_idx = row
    }
    
    func pickerView(_ pickerView: UIPickerView, attributedTitleForRow row: Int, forComponent component: Int) -> NSAttributedString? {
        let titleData = pickerData[row]
        let myTitle = NSAttributedString(string: titleData, attributes: [NSFontAttributeName:UIFont(name: "Georgia", size: 15.0)!,NSForegroundColorAttributeName:UIColor.blue])
        return myTitle
    }
    func pickerView(_ pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusing view: UIView?) -> UIView {
        var pickerLabel = view as! UILabel!
        if view == nil {  //if no label there yet
            pickerLabel = UILabel()
        }
        let titleData = pickerData[row]
        let myTitle = NSAttributedString(string: titleData, attributes: [NSFontAttributeName:UIFont(name: "Georgia", size: 26.0)!,NSForegroundColorAttributeName:UIColor(hue: 0.0722, saturation: 0.7, brightness: 0.93, alpha: 1.0)])
        pickerLabel!.attributedText = myTitle
        pickerLabel!.textAlignment = .center
        return pickerLabel!
    }
    func pickerView(_ pickerView: UIPickerView, rowHeightForComponent component: Int) -> CGFloat {
        return 30.0
    }
    // PICKER VIEW------------------------------------------------------
    
    
    

    //TIMER----------------------------------------------------------------------

    //Countdown Variables
    @IBOutlet weak var mainClock: UILabel!
    var currentDate = NSDate()

    var c_hours: Int = 0
    var c_minutes: Int = 0
    var c_seconds: Int = 0
    var timer = Timer()
    var countdown = Timer()
    var countdownString: String = ""
    var stopwatchString: String = ""
    //Count-up variables
    var hours: Int = 0
    var minutes: Int = 0
    var seconds: Int = 0

    var storedTimes = (1...7).map { _ in timeStorage(hrs: 0, min: 0, sec: 0) }
    var laps = [String](repeating: "00:00:00", count: 7)

    @IBOutlet weak var forwardTimer: UILabel!
    
    
    deinit {
        self.ref.child("messages").removeObserver(withHandle: _refHandle)
    }
    
    func updateCountdown(){
        
        c_seconds -= 1
        if c_seconds == -1{
            c_minutes -= 1
            c_seconds = 59
        }
        if c_minutes == -1{
            c_hours -= 1
            c_minutes = 59
        }
        
        let secondsString = c_seconds > 9 ? "\(c_seconds)" : "0\(c_seconds)"
        let minutesString = c_minutes > 9 ? "\(c_minutes)" : "0\(c_minutes)"
        let hoursString = c_hours > 9 ? "\(c_hours)" : "0\(c_hours)"
        countdownString = "\(hoursString):\(minutesString):\(secondsString)"
        mainClock.text = countdownString
    }

    func updateForwardTimer(){
        seconds += 1
        if seconds == 60{
            minutes += 1
            seconds = 0
        }
        if minutes == 60{
            hours += 1
            minutes = 0
        }
        let secondsString = seconds > 9 ? "\(seconds)" : "0\(seconds)"
        let minutesString = minutes > 9 ? "\(minutes)" : "0\(minutes)"
        let hoursString = hours > 9 ? "\(hours)" : "0\(hours)"
        stopwatchString = "\(hoursString):\(minutesString):\(secondsString)"
        forwardTimer.text = stopwatchString
//        laps[activityIndex] = stopwatchString
//        lapsTableView.reloadData()
        //todo: increase efficiency only load one
    }

    func saveActivityData(idx : Int){
        storedTimes[idx].updateTime(hrs: hours, min: minutes, sec: seconds)
        let sto_sec = storedTimes[idx].seconds
        let sto_min = storedTimes[idx].minutes
        let sto_hr = storedTimes[idx].hours
        
        let secondsString = sto_sec > 9 ? "\(sto_sec)" : "0\(sto_sec)"
        let minutesString = sto_min > 9 ? "\(sto_min)" : "0\(sto_min)"
        let hoursString = sto_hr > 9 ? "\(sto_hr)" : "0\(sto_hr)"
        let rowStr = "\(hoursString):\(minutesString):\(secondsString)"
        laps[idx] = rowStr
        print(rowStr)
//        self.ref.child("users").child(user.uid).setValue(["username": username])

    }

    func setWatch(sec : Int, min : Int, hour : Int){
        seconds = sec
        minutes = min
        hours = hour
        let secondsString = seconds > 9 ? "\(seconds)" : "0\(seconds)"
        let minutesString = minutes > 9 ? "\(minutes)" : "0\(minutes)"
        let hoursString = hours > 9 ? "\(hours)" : "0\(hours)"
        stopwatchString = "\(hoursString):\(minutesString):\(secondsString)"
        forwardTimer.text = stopwatchString
    }

    
    //TIMER----------------------------------------------------------------------
    
    // Instance variables
    @IBOutlet weak var textField: UITextField!
    @IBOutlet weak var sendButton: UIButton!
    @IBOutlet weak var topView: UIButton!
    
    
    
    var ref: FIRDatabaseReference!
    var messages: [FIRDataSnapshot]! = []
    var msglength: NSNumber = 35
    fileprivate var _refHandle: FIRDatabaseHandle!
    
    var storageRef: FIRStorageReference!
    var remoteConfig: FIRRemoteConfig!
    
    @IBOutlet weak var banner: GADBannerView!
    @IBOutlet weak var clientTable: UITableView!

    
    func configureDatabase() {
        ref = FIRDatabase.database().reference()
        // Listen for new messages in the Firebase database
        _refHandle = self.ref.child("messages").observe(.childAdded, with: { [weak self] (snapshot) -> Void in
            guard let strongSelf = self else { return }
            strongSelf.messages.append(snapshot)
            strongSelf.clientTable.insertRows(at: [IndexPath(row: strongSelf.messages.count-1, section: 0)], with: .automatic)
        })
    }
    
    
    
    func configureStorage() {
        let storageUrl = FIRApp.defaultApp()?.options.storageBucket
        storageRef = FIRStorage.storage().reference(forURL: "gs://" + storageUrl!)
    }
    
    func configureRemoteConfig() {
        remoteConfig = FIRRemoteConfig.remoteConfig()
        // Create Remote Config Setting to enable developer mode.
        // Fetching configs from the server is normally limited to 5 requests per hour.
        // Enabling developer mode allows many more requests to be made per hour, so developers
        // can test different config values during development.
        let remoteConfigSettings = FIRRemoteConfigSettings(developerModeEnabled: true)
        remoteConfig.configSettings = remoteConfigSettings!
    }
    
    func fetchConfig() {
        var expirationDuration: Double = 3600
        // If in developer mode cacheExpiration is set to 0 so each fetch will retrieve values from
        // the server.
        if (self.remoteConfig.configSettings.isDeveloperModeEnabled) {
            expirationDuration = 0
        }
        
        // cacheExpirationSeconds is set to cacheExpiration here, indicating that any previously
        // fetched and cached config would be considered expired because it would have been fetched
        // more than cacheExpiration seconds ago. Thus the next fetch would go to the server unless
        // throttling is in progress. The default expiration duration is 43200 (12 hours).
        remoteConfig.fetch(withExpirationDuration: expirationDuration) { (status, error) in
            if (status == .success) {
                print("Config fetched!")
                self.remoteConfig.activateFetched()
                let friendlyMsgLength = self.remoteConfig["friendly_msg_length"]
                if (friendlyMsgLength.source != .static) {
                    self.msglength = friendlyMsgLength.numberValue!
                    print("Friendly msg length config: \(self.msglength)")
                }
            } else {
                print("Config not fetched")
                print("Error \(error)")
            }
        }
    }
    
    @IBAction func didPressFreshConfig(_ sender: AnyObject) {
        fetchConfig()
    }
    
    @IBAction func didSendMessage(_ sender: UIButton) {
        textFieldShouldReturn(textField)
    }
    
    @IBAction func didPressCrash(_ sender: AnyObject) {
        FIRCrashMessage("Cause Crash button clicked")
        fatalError()
    }
    
    func logViewLoaded() {
        FIRCrashMessage("View loaded")
    }
    
//    func loadAd() {
//        self.banner.adUnitID = kBannerAdUnitID
//        self.banner.rootViewController = self
//        self.banner.load(GADRequest())
//    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard let text = textField.text else { return true }
        
        let newLength = text.characters.count + string.characters.count - range.length
        return newLength <= self.msglength.intValue // Bool
    }
    
    // UITableViewDataSource protocol methods
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return messages.count
    }
    
    
    //fixme
//    var viewHasAppeared = false
//    
//    override func viewDidLayoutSubviews() {
//        super.viewDidLayoutSubviews()
//        if viewHasAppeared { goToBottom() }
//    }
//    
//    override func viewDidAppear(_ animated: Bool) {
//        super.viewDidAppear(animated)
//        viewHasAppeared = true
//    }
//    
    private func goToBottom() {
        guard messages.count > 0 else { return }
        let indexPath = NSIndexPath(row: messages.count - 1, section: 0)
        clientTable.scrollToRow(at: indexPath as IndexPath, at: .bottom, animated: true)
        clientTable.layoutIfNeeded()
    }
    //fixme

    @IBAction func scrollToBottom(_ sender: Any) {
        goToBottom()
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // Dequeue cell
        let cell = self.clientTable.dequeueReusableCell(withIdentifier: "tableViewCell", for: indexPath)
        // Unpack message from Firebase DataSnapshot
        let messageSnapshot: FIRDataSnapshot! = self.messages[indexPath.row]
        let message = messageSnapshot.value as! Dictionary<String, String>
        let name = message[Constants.MessageFields.name] as String!
        if let imageURL = message[Constants.MessageFields.imageURL] {
            if imageURL.hasPrefix("gs://") {
                FIRStorage.storage().reference(forURL: imageURL).data(withMaxSize: INT64_MAX){ (data, error) in
                    if let error = error {
                        print("Error downloading: \(error)")
                        return
                    }
                    cell.imageView?.image = UIImage.init(data: data!)
                }
            } else if let URL = URL(string: imageURL), let data = try? Data(contentsOf: URL) {
                cell.imageView?.image = UIImage.init(data: data)
            }
            cell.textLabel?.text = "sent by: \(name)"
        } else {
            let text = message[Constants.MessageFields.text] as String!
            cell.textLabel?.text = name! + ": " + text!
            cell.imageView?.image = UIImage(named: "ic_account_circle")
            if let photoURL = message[Constants.MessageFields.photoURL], let URL = URL(string: photoURL), let data = try? Data(contentsOf: URL) {
                cell.imageView?.image = UIImage(data: data)
            }
        }
        cell.textLabel?.font = UIFont(name:"Avenir", size:15)
        return cell
    }
    
    
    
    // UITextViewDelegate protocol methods
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        guard let text = textField.text else { return true }
        let data = [Constants.MessageFields.text: text]
        textField.text = ""
        sendMessage(withData: data)
        return true
    }
    
    func sendMessage(withData data: [String: String]) {
        var mdata = data

        mdata[Constants.MessageFields.name] = AppState.sharedInstance.displayName
        if let photoURL = AppState.sharedInstance.photoURL {
            mdata[Constants.MessageFields.photoURL] = photoURL.absoluteString
        }
        // Push data to Firebase Database
        self.ref.child("messages").childByAutoId().setValue(mdata)
        goToBottom()
    }
    
    @IBOutlet weak var signOut: UIButton!
    
    class BorderedButton: UIButton {
        
        required init?(coder aDecoder: NSCoder) {
            super.init(coder: aDecoder)
            layer.borderWidth = 1.0
            layer.borderColor = tintColor.cgColor
            layer.cornerRadius = 5.0
            clipsToBounds = true
            contentEdgeInsets = UIEdgeInsets(top: 8, left: 8, bottom: 8, right: 8)
            setTitleColor(tintColor, for: .normal)
            setTitleColor(UIColor.white, for: .highlighted)
     
            //setBackgroundImage(UIImage(color: tintColor), for: .Highlighted)
        }
    }

    
    
    @IBAction func signOut(_ sender: UIButton) {
        let firebaseAuth = FIRAuth.auth()
        do {
            try firebaseAuth?.signOut()
            AppState.sharedInstance.signedIn = false
            dismiss(animated: true, completion: nil)
        } catch let signOutError as NSError {
            print ("Error signing out: \(signOutError.localizedDescription)")
        }
    }
    
    func showAlert(withTitle title:String, message:String) {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: title,
                                          message: message, preferredStyle: .alert)
            let dismissAction = UIAlertAction(title: "Dismiss", style: .destructive, handler: nil)
            alert.addAction(dismissAction)
            self.present(alert, animated: true, completion: nil)
        }
    }
    
}
