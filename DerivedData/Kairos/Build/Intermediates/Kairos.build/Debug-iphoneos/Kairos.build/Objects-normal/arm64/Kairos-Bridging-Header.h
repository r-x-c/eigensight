// Generated by Apple Swift version 3.0.1 (swiftlang-800.0.58.6 clang-800.0.42.1)
#pragma clang diagnostic push

#if defined(__has_include) && __has_include(<swift/objc-prologue.h>)
# include <swift/objc-prologue.h>
#endif

#pragma clang diagnostic ignored "-Wauto-import"
#include <objc/NSObject.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#if !defined(SWIFT_TYPEDEFS)
# define SWIFT_TYPEDEFS 1
# if defined(__has_include) && __has_include(<uchar.h>)
#  include <uchar.h>
# elif !defined(__cplusplus) || __cplusplus < 201103L
typedef uint_least16_t char16_t;
typedef uint_least32_t char32_t;
# endif
typedef float swift_float2  __attribute__((__ext_vector_type__(2)));
typedef float swift_float3  __attribute__((__ext_vector_type__(3)));
typedef float swift_float4  __attribute__((__ext_vector_type__(4)));
typedef double swift_double2  __attribute__((__ext_vector_type__(2)));
typedef double swift_double3  __attribute__((__ext_vector_type__(3)));
typedef double swift_double4  __attribute__((__ext_vector_type__(4)));
typedef int swift_int2  __attribute__((__ext_vector_type__(2)));
typedef int swift_int3  __attribute__((__ext_vector_type__(3)));
typedef int swift_int4  __attribute__((__ext_vector_type__(4)));
typedef unsigned int swift_uint2  __attribute__((__ext_vector_type__(2)));
typedef unsigned int swift_uint3  __attribute__((__ext_vector_type__(3)));
typedef unsigned int swift_uint4  __attribute__((__ext_vector_type__(4)));
#endif

#if !defined(SWIFT_PASTE)
# define SWIFT_PASTE_HELPER(x, y) x##y
# define SWIFT_PASTE(x, y) SWIFT_PASTE_HELPER(x, y)
#endif
#if !defined(SWIFT_METATYPE)
# define SWIFT_METATYPE(X) Class
#endif
#if !defined(SWIFT_CLASS_PROPERTY)
# if __has_feature(objc_class_property)
#  define SWIFT_CLASS_PROPERTY(...) __VA_ARGS__
# else
#  define SWIFT_CLASS_PROPERTY(...)
# endif
#endif

#if defined(__has_attribute) && __has_attribute(objc_runtime_name)
# define SWIFT_RUNTIME_NAME(X) __attribute__((objc_runtime_name(X)))
#else
# define SWIFT_RUNTIME_NAME(X)
#endif
#if defined(__has_attribute) && __has_attribute(swift_name)
# define SWIFT_COMPILE_NAME(X) __attribute__((swift_name(X)))
#else
# define SWIFT_COMPILE_NAME(X)
#endif
#if defined(__has_attribute) && __has_attribute(objc_method_family)
# define SWIFT_METHOD_FAMILY(X) __attribute__((objc_method_family(X)))
#else
# define SWIFT_METHOD_FAMILY(X)
#endif
#if defined(__has_attribute) && __has_attribute(noescape)
# define SWIFT_NOESCAPE __attribute__((noescape))
#else
# define SWIFT_NOESCAPE
#endif
#if !defined(SWIFT_CLASS_EXTRA)
# define SWIFT_CLASS_EXTRA
#endif
#if !defined(SWIFT_PROTOCOL_EXTRA)
# define SWIFT_PROTOCOL_EXTRA
#endif
#if !defined(SWIFT_ENUM_EXTRA)
# define SWIFT_ENUM_EXTRA
#endif
#if !defined(SWIFT_CLASS)
# if defined(__has_attribute) && __has_attribute(objc_subclassing_restricted)
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# else
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# endif
#endif

#if !defined(SWIFT_PROTOCOL)
# define SWIFT_PROTOCOL(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
# define SWIFT_PROTOCOL_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
#endif

#if !defined(SWIFT_EXTENSION)
# define SWIFT_EXTENSION(M) SWIFT_PASTE(M##_Swift_, __LINE__)
#endif

#if !defined(OBJC_DESIGNATED_INITIALIZER)
# if defined(__has_attribute) && __has_attribute(objc_designated_initializer)
#  define OBJC_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
# else
#  define OBJC_DESIGNATED_INITIALIZER
# endif
#endif
#if !defined(SWIFT_ENUM)
# define SWIFT_ENUM(_type, _name) enum _name : _type _name; enum SWIFT_ENUM_EXTRA _name : _type
# if defined(__has_feature) && __has_feature(generalized_swift_name)
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME) enum _name : _type _name SWIFT_COMPILE_NAME(SWIFT_NAME); enum SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_ENUM_EXTRA _name : _type
# else
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME) SWIFT_ENUM(_type, _name)
# endif
#endif
#if !defined(SWIFT_UNAVAILABLE)
# define SWIFT_UNAVAILABLE __attribute__((unavailable))
#endif
#if defined(__has_feature) && __has_feature(modules)
@import UIKit;
@import GoogleSignIn;
@import Foundation;
@import ObjectiveC;
@import CoreGraphics;
#endif

#pragma clang diagnostic ignored "-Wproperty-attribute-mismatch"
#pragma clang diagnostic ignored "-Wduplicate-method-arg"
@class UIWindow;
@class UIApplication;
@class NSObject;
@class GIDSignIn;
@class GIDGoogleUser;
@class NSError;

SWIFT_CLASS("_TtC6Kairos11AppDelegate")
@interface AppDelegate : UIResponder <GIDSignInDelegate, UIApplicationDelegate>
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@property (nonatomic, strong) UIWindow * _Nullable window;
- (BOOL)applicationWithApplication:(UIApplication * _Nonnull)application didFinishLaunchingWithOptions:(NSDictionary * _Nullable)launchOptions;
- (BOOL)application:(UIApplication * _Nonnull)app openURL:(NSURL * _Nonnull)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> * _Nonnull)options;
- (void)signIn:(GIDSignIn * _Null_unspecified)signIn didSignInForUser:(GIDGoogleUser * _Null_unspecified)user withError:(NSError * _Null_unspecified)error;
- (void)signInSignIn:(GIDSignIn * _Null_unspecified)signIn didDisconnectWithUser:(GIDGoogleUser * _Null_unspecified)user withError:(NSError * _Null_unspecified)error;
@end


SWIFT_CLASS("_TtC6Kairos8AppState")
@interface AppState : NSObject
SWIFT_CLASS_PROPERTY(@property (nonatomic, class, readonly, strong) AppState * _Nonnull sharedInstance;)
+ (AppState * _Nonnull)sharedInstance;
@property (nonatomic) BOOL signedIn;
@property (nonatomic, copy) NSString * _Nullable displayName;
@property (nonatomic, copy) NSURL * _Nullable photoURL;
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end

@class NSDateFormatter;
@class NSUserDefaults;
@class UIPickerView;
@class NSAttributedString;
@class UIView;
@class NSDate;
@class NSTimer;
@class FIRDatabaseReference;
@class FIRDataSnapshot;
@class NSNumber;
@class FIRStorageReference;
@class FIRRemoteConfig;
@class UIButton;
@class UITextField;
@class UITableView;
@class UITableViewCell;
@class UILabel;
@class GADBannerView;
@class NSBundle;
@class NSCoder;

SWIFT_CLASS_NAMED("FCViewController")
@interface FCViewController : UIViewController <UIScrollViewDelegate, UITableViewDelegate, UITextFieldDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate, UIPickerViewDataSource, UIPickerViewDelegate, UITableViewDataSource>
@property (nonatomic, copy) NSString * _Nonnull date_string;
@property (nonatomic, readonly, strong) NSDateFormatter * _Nonnull date_formatter;
@property (nonatomic, readonly, strong) NSDateFormatter * _Nonnull formatter_timestamp;
@property (nonatomic, readonly, strong) NSUserDefaults * _Nonnull defaults;
@property (nonatomic) NSInteger activityIndex;
- (void)viewDidLoad;
@property (nonatomic, weak) IBOutlet UIPickerView * _Null_unspecified pickerView;
@property (nonatomic, weak) IBOutlet UILabel * _Null_unspecified pickerText;
@property (nonatomic) NSInteger curr_hour;
@property (nonatomic) NSInteger curr_min;
@property (nonatomic) NSInteger curr_sec;
@property (nonatomic, copy) NSString * _Nonnull secondsString;
@property (nonatomic, copy) NSString * _Nonnull minutesString;
@property (nonatomic, copy) NSString * _Nonnull hoursString;
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView * _Nonnull)pickerView;
@property (nonatomic, readonly, copy) NSArray<NSString *> * _Nonnull pickerData;
- (NSInteger)pickerView:(UIPickerView * _Nonnull)pickerView numberOfRowsInComponent:(NSInteger)component;
- (NSString * _Nullable)pickerView:(UIPickerView * _Nonnull)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component;
@property (nonatomic) double pastActivity;
@property (nonatomic) double currActivity;
@property (nonatomic) double timeDelta;
- (void)pickerView:(UIPickerView * _Nonnull)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component;
- (NSAttributedString * _Nullable)pickerView:(UIPickerView * _Nonnull)pickerView attributedTitleForRow:(NSInteger)row forComponent:(NSInteger)component;
- (UIView * _Nonnull)pickerView:(UIPickerView * _Nonnull)pickerView viewForRow:(NSInteger)row forComponent:(NSInteger)component reusingView:(UIView * _Nullable)view;
- (CGFloat)pickerView:(UIPickerView * _Nonnull)pickerView rowHeightForComponent:(NSInteger)component;
@property (nonatomic, weak) IBOutlet UILabel * _Null_unspecified mainClock;
@property (nonatomic, strong) NSDate * _Nonnull currentDate;
@property (nonatomic) NSInteger c_hours;
@property (nonatomic) NSInteger c_minutes;
@property (nonatomic) NSInteger c_seconds;
@property (nonatomic, strong) NSTimer * _Nonnull timer;
@property (nonatomic, strong) NSTimer * _Nonnull countdown;
@property (nonatomic, copy) NSString * _Nonnull countdownString;
@property (nonatomic) NSInteger hours;
@property (nonatomic) NSInteger minutes;
@property (nonatomic) NSInteger seconds;
@property (nonatomic, copy) NSString * _Nonnull stopwatchString;
@property (nonatomic, copy) NSArray<NSString *> * _Nonnull laps;
@property (nonatomic, copy) NSArray<NSNumber *> * _Nonnull timeArray;
@property (nonatomic, copy) NSArray<NSNumber *> * _Nonnull percentArray;
@property (nonatomic, weak) IBOutlet UILabel * _Null_unspecified forwardTimer;
- (void)updateCountdown;
- (void)updateForwardTimer;
- (void)setWatchWithHour:(NSInteger)hour min:(NSInteger)min sec:(NSInteger)sec;
@property (nonatomic, weak) IBOutlet UITextField * _Null_unspecified textField;
@property (nonatomic, weak) IBOutlet UIButton * _Null_unspecified sendButton;
@property (nonatomic, weak) IBOutlet UIButton * _Null_unspecified topView;
@property (nonatomic, strong) FIRDatabaseReference * _Null_unspecified ref;
@property (nonatomic, copy) NSArray<FIRDataSnapshot *> * _Null_unspecified messages;
@property (nonatomic, strong) NSNumber * _Nonnull msglength;
@property (nonatomic, strong) FIRStorageReference * _Null_unspecified storageRef;
@property (nonatomic, strong) FIRRemoteConfig * _Null_unspecified remoteConfig;
@property (nonatomic, weak) IBOutlet GADBannerView * _Null_unspecified banner;
@property (nonatomic, weak) IBOutlet UITableView * _Null_unspecified clientTable;
- (void)configureDatabase;
- (void)configureTimeArray;
- (void)configureStorage;
- (void)configureRemoteConfig;
- (void)fetchConfig;
- (IBAction)didPressFreshConfig:(id _Nonnull)sender;
- (IBAction)didSendMessage:(UIButton * _Nonnull)sender;
- (IBAction)didPressCrash:(id _Nonnull)sender;
- (void)logViewLoaded;
- (BOOL)textField:(UITextField * _Nonnull)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString * _Nonnull)string;
- (NSInteger)tableView:(UITableView * _Nonnull)tableView numberOfRowsInSection:(NSInteger)section;
- (IBAction)scrollToBottom:(id _Nonnull)sender;
- (UITableViewCell * _Nonnull)tableView:(UITableView * _Nonnull)tableView cellForRowAtIndexPath:(NSIndexPath * _Nonnull)indexPath;
- (BOOL)textFieldShouldReturn:(UITextField * _Nonnull)textField;
- (void)sendTimeLogWithData:(double)data;
- (void)sendMessageWithData:(NSDictionary<NSString *, NSString *> * _Nonnull)data;
@property (nonatomic, weak) IBOutlet UIButton * _Null_unspecified signOut;
- (IBAction)signOut:(UIButton * _Nonnull)sender;
- (void)showAlertWithTitle:(NSString * _Nonnull)title message:(NSString * _Nonnull)message;
- (nonnull instancetype)initWithNibName:(NSString * _Nullable)nibNameOrNil bundle:(NSBundle * _Nullable)nibBundleOrNil OBJC_DESIGNATED_INITIALIZER;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
@end


SWIFT_CLASS("_TtC6Kairos17MeasurementHelper")
@interface MeasurementHelper : NSObject
+ (void)sendLoginEvent;
+ (void)sendLogoutEvent;
+ (void)sendMessageEvent;
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end


@interface NSDate (SWIFT_EXTENSION(Kairos))
- (NSInteger)hour;
- (NSInteger)minute;
- (NSInteger)second;
- (NSString * _Nonnull)toShortTimeString;
@end

@class FIRUser;
@class GIDSignInButton;

SWIFT_CLASS_NAMED("SignInViewController")
@interface SignInViewController : UIViewController <GIDSignInDelegate, GIDSignInUIDelegate>
@property (nonatomic, weak) IBOutlet UITextField * _Null_unspecified emailField;
@property (nonatomic, weak) IBOutlet UITextField * _Null_unspecified passwordField;
@property (nonatomic, weak) IBOutlet GIDSignInButton * _Null_unspecified signInButton;
- (void)viewDidLoad;
- (void)signIn:(GIDSignIn * _Null_unspecified)signIn didSignInForUser:(GIDGoogleUser * _Null_unspecified)user withError:(NSError * _Null_unspecified)error;
- (void)signWithSignIn:(GIDSignIn * _Null_unspecified)signIn didDisconnectWithUser:(GIDGoogleUser * _Null_unspecified)user withError:(NSError * _Null_unspecified)error;
- (void)viewDidAppear:(BOOL)animated;
- (IBAction)didTapSignIn:(id _Nonnull)sender;
- (IBAction)didTapSignUp:(id _Nonnull)sender;
- (void)setDisplayName:(FIRUser * _Nonnull)user;
- (IBAction)didRequestPasswordReset:(id _Nonnull)sender;
- (void)signedIn:(FIRUser * _Nullable)user;
- (nonnull instancetype)initWithNibName:(NSString * _Nullable)nibNameOrNil bundle:(NSBundle * _Nullable)nibBundleOrNil OBJC_DESIGNATED_INITIALIZER;
- (nullable instancetype)initWithCoder:(NSCoder * _Nonnull)aDecoder OBJC_DESIGNATED_INITIALIZER;
@end


@interface UIViewController (SWIFT_EXTENSION(Kairos))
- (void)hideKeyboardWhenTappedAround;
- (void)dismissKeyboardView;
@end

#pragma clang diagnostic pop
