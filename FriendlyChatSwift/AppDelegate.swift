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

import UIKit
import Firebase
import FirebaseAuth
import GoogleSignIn

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, GIDSignInDelegate {
    
    var window: UIWindow?
    
    
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        FIRApp.configure()
        GIDSignIn.sharedInstance().clientID = FIRApp.defaultApp()?.options.clientID
        GIDSignIn.sharedInstance().delegate = self
        return true
    }
    

    
//    func application(_ application: UIApplication, didFinishLaunchingWithOptions
//        launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
//        FIRApp.configure()
//        GIDSignIn.sharedInstance().clientID = FIRApp.defaultApp()?.options.clientID
//        GIDSignIn.sharedInstance().delegate = self
//
//        return true
//    }
    func application(_ app: UIApplication, open url: URL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
        return GIDSignIn.sharedInstance().handle(
            url,
            sourceApplication: options[UIApplicationOpenURLOptionsKey.sourceApplication] as! String,
            annotation: options[UIApplicationOpenURLOptionsKey.annotation])
    }
    
//    func application(application: UIApplication,
//                     openURL url: NSURL, sourceApplication: String?, annotation: AnyObject?) -> Bool {
//        var options: [String: AnyObject] = [UIApplicationOpenURLOptionsKey.sourceApplication.rawValue: sourceApplication as AnyObject,
//                                            UIApplicationOpenURLOptionsKey.annotation.rawValue: annotation!]
//        return GIDSignIn.sharedInstance().handle(url as URL!,
//                                                    sourceApplication: sourceApplication,
//                                                    annotation: annotation)
//    }

    
    private func sign(signIn: GIDSignIn!, didSignInForUser user: GIDGoogleUser!,
                withError error: NSError!) {
        if let error = error {
            print(error.localizedDescription)
            return
        }
        let authentication = user.authentication
        let credential = FIRGoogleAuthProvider.credential(withIDToken: (authentication?.idToken)!,
                                                                     accessToken: (authentication?.accessToken)!)
        
        
        FIRAuth.auth()?.signIn(with: credential) { (user, error) in
            // ...
        }
    }
    
    func sign(_ signIn: GIDSignIn!, didSignInFor user:GIDGoogleUser!,
                withError error: Error!) {
        // Perform any operations when the user disconnects from app here.
        // ...
    }

}
