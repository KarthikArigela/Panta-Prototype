# How I Ended Up Spending a Week Understanding E&S Insurance

I found Panta while going through YC W26 companies. Honestly, most insurtech pitches are the same thing repackaged. "We're making insurance simple with AI." "Insurance in an app." "Disrupting the $X trillion industry." After a while, you stop reading.

But Panta's positioning made me pause. Digital E&S Brokerage.

Not auto insurance. Not home insurance. E&S. The stuff that standard carriers refuse to touch. Cannabis dispensaries, trucking companies with bad accident records, construction firms doing high-rise work. The messy, high-risk, low-competition corner of insurance that nobody wants to deal with.

Why would a YC company deliberately choose the hardest possible market to enter? I had to find out.

Read My_entire_Prototype_Process.md file to understand the process I went through to build this.

---

## What I Actually Learned

### 1. The E&S Market is Counterintuitive

My first instinct was wrong. I assumed complex meant bad. Turns out, complex means defensible.

Standard insurance (auto, home, renters) is basically a solved problem. Low margins, saturated competition, commoditized technology. Every fintech and their cousin is building "insurance in an app."

E&S is the opposite. High margins because the risks are genuinely hard to price. Low competition because most companies cannot handle the regulatory overhead. Terrible technology because everyone still runs on PDFs, faxes, and 40-page ACORD forms.

To be frank, this is one of the few remaining opportunities in fintech where being good at hard things actually matters.

### 2. I Traced an Actual Customer Journey

I wanted to understand the pain, not just read about it. So I simulated (Not real User Journey) what a California trucking company owner goes through when buying E&S insurance in 2026.

I called him "Heavy Haul Hank" in my notes. 10 trucks, hazardous cargo, two accidents on record. Standard carriers rejected him. He has no choice but to go E&S.

Here is what Hank faces:

**Days 1-7: The 40-Page Headache**
His local broker, "Local Larry," sends him an ACORD form. 40 pages. Hank spends 3 days digging through filing cabinets for VIN numbers, driver's license copies, and loss history. He scans everything and emails it back. Larry forwards it to a Wholesale Broker Wendy, because Larry is not allowed to talk to E&S carriers directly. The application sits in a queue.

**Days 8-14: The Email Ping-Pong**
An underwriter at Lloyd's finally looks at the PDF. Spots a gap. "Does Hank haul chemicals across state lines? The form doesn't say."

Now the email chain begins. Underwriter emails the wholesaler. Wholesaler emails Larry. Larry calls Hank. Hank answers. Larry emails the wholesaler. Wholesaler emails the underwriter.

4 days. For one question.

**Days 15-21: The California Premium**
A quote finally comes back. $32,000 per year for one trucking operation. That is up from $12,000 in 2021. The 2026 hard market is brutal.

But that is not the full cost. Hank needs 25% down payment upfront. Plus 3.00% California Surplus Lines Tax. Plus 0.18% Stamping Fee. He is wiring nearly $10,000 before the policy even starts.

**Days 22-26: The CARB VIN Lock**
Right before binding, the insurer's system runs Hank's truck VIN through the California Air Resources Board database. Problem. The previous owner missed a smog sensor reporting cycle. The VIN is flagged.

The insurer refuses to bind coverage on a "non-compliant asset." Hank spends 3 more days getting a rush emissions test to clear the flag.

**Total time: 26 days. Total upfront cash: roughly $12,000. Status: High stress, thin margins.**

That is the reality. Not a hypothetical. This is what business owners face every time they need E&S coverage.

### 3. Why Most Deals Actually Die

Here is the insight that changed how I think about this problem.

90% of E&S deals do not die because carriers reject the risk. They die because of "dirty submissions."

A business owner fills out a generic form. They leave the "Radius of Operation" field blank because they did not understand what it meant. The broker sends it anyway. The underwriter sees a blank field, assumes the worst, and throws the application in the trash.

The risk might have been perfectly insurable. But the data was garbage, so the deal died.

This is the bottleneck. Not finding carriers. Not pricing risk. Getting clean, complete applications to underwriters.

---

## Why Panta's Approach Makes Sense

I spent time on Panta's website trying to understand the positioning. A few things stood out.

### They are Replacing the Broker, Not Helping the Broker

The website speaks directly to business owners. "Join hundreds of businesses who switched to Panta." Not "Agents, bring your books to us."

This is a direct-to-consumer play in a market that has always been intermediated. Bold.

### They are Combining Retail and Wholesale Access

Normally, From above simulated example, a Retail Broker (Larry) needs a Wholesaler (Wendy) to access E&S carriers. Two middlemen, two markups, two delays.

Panta claims direct access to "100+ A-rated carriers" including "E&S, wholesale, and direct." They are cutting out a layer.

### The Bet They are Making

Panta is betting that business owners are willing to buy complex, high-stakes insurance online without shaking someone's hand. That is a real behavioral change.

They are addressing the fear with "Human Expertise, AI Speed." Licensed brokers still steer the ship, but AI handles the paperwork. May be this is the right balance. May be it is not. But I understand why they are trying it.

---

## The Keystone Feature I Would Build First

If I joined Panta and could only build one thing, I would not build a quoting engine. Too expensive, requires carrier API partnerships that take months to negotiate. I would not build a policy dashboard. Premature, only matters after you have customers.

I would build the data sanitation layer.

### Why This Matters

Every time Panta sends a submission to a carrier, that submission needs to be perfect. Complete. Typed, not handwritten. Every field filled correctly.

If Panta's submissions are always clean, two things happen:

1. Underwriters start prioritizing Panta's applications. They are overworked. They love brokers who do not waste their time.

2. Panta can "fake" the sophisticated tech stack. Users get a beautiful digital experience. On the backend, humans can still manually email the PDFs to carriers. You do not need carrier APIs on day one. You just need clean data.

### The Smart Intake Approach

Instead of sending users a 40-page PDF and hoping they fill it out correctly, you build a conditional logic form.

**Stage 1: Hard Knockout**
Ask the kill questions first. 
Example:
"Have you had your operating authority revoked?" 
"Is your Safety Rating Unsatisfactory?" 
If yes, stop immediately. Do not waste anyone's time.

**Stage 2: Risk Classifier**
Ask questions that determine what follow-ups are needed. 
Example:
1. "Do you haul Hazardous Materials?" 
If yes, trigger the Hazmat endorsement question and pollution liability section. 
2. "What is your radius of operation?" 
If over 500 miles, flag as Long Haul for different carrier appetite.

**Stage 3: Skeleton**
Collect the boring basics that every application needs. 
Example:
Legal entity name, address, DOT number, fleet size, revenue. These map directly to ACORD 125 and 127.

**Stage 4: Document Gate**
Do not let users submit until they upload the required documents.
Example:
Loss runs. Driver schedule. Vehicle list. No more chasing clients for missing paperwork.

The output is a perfectly formatted submission packet ready to forward to carriers. What used to take 3 days of back-and-forth now takes 15 minutes.

---

## About Me

I spent roughly two weeks on this research. Nobody asked me to do this. I did it because I wanted to understand whether Panta is building something real or just another insurtech company with a good landing page.

My conclusion: it is real. The E&S market has genuine structural problems that technology can solve. Panta's positioning makes sense. Of course! The landing page Copywriting can be improved more to clarify the E&S market Niche that we are targeting. The direct-to-consumer bet is risky, but the alternative is competing with Lemonade and Root in a saturated market with 2% margins. I understand why you chose hard.

What I figured out during this process (Based on My Opinion only):

1. The keystone feature is not the quoting engine or the policy dashboard. It is the data sanitation layer. If your submissions are always clean, everything else follows. Carriers prioritize you. You can fake the sophisticated backend with humans on day one.

2. You need to design for two customers at once. The business owner wants simplicity. The underwriter wants completeness. Most forms optimize for one and fail the other. The conditional logic approach solves both.

3. The specific questions matter with a readability of a 5th grader. "Do you haul Hazmat?" is not the same as "Do you haul chemicals?" One triggers specific carrier appetite flags. The other is vague enough to get ignored. Domain knowledge is not optional here.

To be frank, I do not have years of insurance industry experience. I learned all of this in the past one week by reading, simulating (Not real User Journey) customer journeys, and mapping out the regulatory requirements.

What I do have: the ability to go deep on a complex domain quickly, identify where the leverage is, and build something that works. I have done this before in other contexts. The insurance industry is new to me, but the process is not.

---

## What I Built

I built a working prototype of the Smart Intake for trucking. Four-stage funnel: Hard Knockout, Risk Classifier, Skeleton, Document Gate.

It is not a polished product. It is a proof of concept that demonstrates one thing: asking the right 5 questions in sequence, with conditional logic, produces better data than handing someone a 40-page PDF and hoping they fill it out correctly.

(https://panta.karthikarigela.in/)

---

That is it.

This document exists because I wanted to understand the problem Panta is solving. Not at a surface level, but at the level of "here is what a California trucking company owner actually goes through in January 2026 when they need E&S coverage."

I now understand it. And I built something to prove I understand it.

Note: Read My entire Prototype Process.md file to understand the process I went through to build this.