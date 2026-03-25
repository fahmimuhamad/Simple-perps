# Project Prompts Log

All prompts in full detail, exactly as typed, in chronological order.

---

## Session 1 — Initial Setup

**1.**
```
impleemtn this using next js https://www.figma.com/design/OMkLZphIocDj0nZ9hzGQKS/branch/v2kPF9KgANeqVkHJ46iptb/Futures---App-Main?m=auto&node-id=22395-16756&t=9zsUWO3nGmRoXZl4-1
```

**2.**
```
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22395-16756&m=dev
```

---

## Session 2 — Order Type Sheet & Leverage Sheet

**3.**
```
improve the ui based on this file Implement this design from Figma. @https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18173&m=dev
```

**4.**
```
Implement this design from Figma as the first screen that appear. When user click long button it will open the order type sheet with long configuration but when user click short it will change to short configuration with text open short postion and with red color.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-19287&m=dev
```

**5.**
```
make the est profit and est lost using real calculation not dummy as on the screen
```

**6.**
```
Implement this design from Figma so that when user click Leverage on the order type sheet it will open this design. Make the slider interaction Dragging the slider moves between fixed leverage increments, Each step change produces subtle haptic feedback, creating a distinct "tick" sensation, The haptic feel should resemble a mechanical dial locking into place, The selected value updates instantly and animates smoothly, The active tick mark visually highlights when selected, Pressing "Min" or "Max" jumps directly to the lowest or highest leverage with matching haptic feedback, nsure the interaction feels precise, controlled, and trustworthy, Brief micro-animation when the leverage value changes, Slight emphasis animation on the selected tick, min 1 and max 25.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18388&m=dev
```

**7.**
```
its error the selected leverage for the silder should be in the middle with taller size not on the right
```

**8.**
```
remove this <div class="absolute top-0 bottom-0 pointer-events-none z-10" style="left: 50%; width: 2px; transform: translateX(-50%); background: rgb(2, 2, 3); border-radius: 2px;"></div>
```

**9.**
```
when leverage change it will also impact the est profit and loss
```

**10.**
```
Implement this design from Figma.
@https://www.figma.com/design/1diPkc3Go6bjFkLfjzjr9h/T2-Isolated-Margin?node-id=20320-20946&m=dev so that when user click open position long or open position short this confirmation file will appear the side will be depend on they sell short or buy long with red for short and green for long
```

---

## Session 3 — Confirmation Sheet & Coachmarks

**11.**
```
Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-26583&m=dev so that when user click confirm they will be back to initial screen with open position card but for first time user there will be a coachmark: here's the 1st one  @https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-20520&m=dev , and this is the second one after they click next @https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-20105&m=dev and heres the last one @https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-19691&m=dev
```

**12.**
```
make the screen size fix but scrollabel and make the Bottom Navigation Futures fixed
```

**13.**
```
the coachmark is not as expexted and not the same in the figma, also i cannot scroll when the coach mark appear or make it auto scroll when the coachmark in the bottom
```

---

## Session 4 — TP/SL Sheet

**14.**
```
Implement this design from Figma so when user click edit button on your est ptofit and your est loss section on order type sheet will open that desing. Make sure the calculation is correct.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18851&m=dev
```

**15.**
```
improve the ordertypesheet with this new design @https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18173&m=dev where the amount is bold and have invesment amount above that and make usdt 0 as the default for invesment amount and when zero the button is disable which -60% opacity.
```

**16.**
```
When the user uncheck the take profit and stop loss on tpslsheet and they click confirm the tp/sl on oredrtypesheet should be like this Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18817&m=dev
```

**17.**
```
when i check the tpl/sl on tpslsheet the estimated profit should be number, u should calculate it not only - it should be like this @https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-19058&m=dev but the value is based on the tp sl that the user input so the sytem will calculate it
```

**18.**
```
make the edit button dissable when invested amount 0 and Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18817&m=dev when invested amount 0
```

**19.**
```
1. correc the Est. Liquidation Price on tpslsheet calculation also on Trigger Price (USDT) text field when empty change the place holder to enter price and when move to pnl the Profit Rate should be price change x leverage and when user add sl both on price and % PNL > liq price it will be have error message Stop Loss Trigger Price must be higher than Liquidation Price with red color and the textfiled outline also become red.

2. when user add the invesment amount > available margin the system will force the amout to = margin available so that whatever they type if thats > avaliable margin it will = available margin
```

**20.**
```
since this isolated calculate the Est. Liquidation Price based on leverage that they use
```

**21.**
```
why long and shor have different 0.5%? make it same
```

**22.**
```
make both long and short 4% from entry if using 25x
```

**23.**
```
why stoploss profit rate cannot 100%? make it max 100%
```

---

## Session 5 — Order Sheet Redesign, Confirmation & Live Data

**24.**
```
improve the ordertypesheet and Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18173&m=dev
```

**25.**
```
Implement this design from Figma so that when user click open long or open short will have confirmation sheet first.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22595-30204&m=dev
```

**26.**
```
can u make the chart and price move based on binance price using their api or something
```

**27.**
```
implement that also on funding fee / countdown and user position distribution (long short ratio)
```

**28.**
```
improve the position card with this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22676-8143&m=dev
```

**29.**
```
improve the oredertypesheet and Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-23175&m=dev
```

**30.**
```
on the position card it is not ! <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#0a68f4"></circle><path d="M7 4.5v.5M7 6.5v3" stroke="white" stroke-width="1.2" stroke-linecap="round"></path></svg>

should be + like this <button class="w-[12px] h-[12px] flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" fill="#0a68f4"></circle><path d="M6 3.5v5M3.5 6h5" stroke="white" stroke-width="1.5" stroke-linecap="round"></path></svg></button>
```

---

## Session 6 — Leverage Sheet, Add/Remove Margin & Chart Toggle

**31.**
```
improve leverage sheet and Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-18388&m=dev
```

**32.**
```
Implement this design from Figma.
@https://www.figma.com/design/1diPkc3Go6bjFkLfjzjr9h/T2-Isolated-Margin?node-id=22663-37444&m=dev so that when user click + icon on position card they can add or remove margin(Implement this design from Figma.
@https://www.figma.com/design/1diPkc3Go6bjFkLfjzjr9h/T2-Isolated-Margin?node-id=22663-39252&m=dev)and make the system recalculate everything again
```

**33.**
```
if margin added Implement this design from Figma.
@https://www.figma.com/design/1diPkc3Go6bjFkLfjzjr9h/T2-Isolated-Margin?node-id=22447-38762&m=dev where there is a new ilquidation price
```

**34.**
```
Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simpl1ify-Perps?node-id=22431-18388&m=dev check again the slider interaction and so on in leverage sheet i think there is something that not the same as expected. bassicaly use the interaction like before
```

**35.**
```
make Selected tick is taller a bit
```

**36.**
```
still small make it more taller
```

**37.**
```
reduce margin Selected tick bar with the min max button
```

**38.**
```
change chart into line chart
```

**39.**
```
make this to change between line chart and candle stick <div class="bg-[rgba(2,2,3,0.1)] flex items-center p-[1.3px] rounded-full overflow-hidden"><div class="bg-white flex items-center p-[2.7px] rounded-full"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 8L4 5l2.5 2.5L9 3" stroke="#020203" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><div class="flex items-center p-[2.7px] rounded-full opacity-60"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="2" y="4" width="2" height="5" rx="0.5" stroke="#020203" stroke-width="1"></rect><rect x="7" y="2" width="2" height="7" rx="0.5" stroke="#020203" stroke-width="1"></rect><path d="M3 6.5V4M8 4.5V2" stroke="#020203" stroke-width="1" stroke-linecap="round"></path></svg></div></div>
```

**40.**
```
remove active number above the slider on leverage sheet and minimize margin between slider and button min max
```

---

## Session 7 — Polish & Fixes

**41.**
```
still have gap between active slider into the comopnent above it
```

**42.**
```
add number above inactive slider
```

**43.**
```
improve the tpslsheet and Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22718-10929&m=dev for the tp based on pnl which amount user will get when tp is hit and Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22718-10580&m=dev for tp based on price and connect this sheet to pencil icon on position card
```

**44.**
```
improve the header on initial screen and Implement this design from Figma.
@https://www.figma.com/design/v2kPF9KgANeqVkHJ46iptb/T2-Simplify-Perps?node-id=22431-19681&m=dev
```

**45.**
```
link adjust leverage button on position card to leveragesheet
```

**46.**
```
reduce top padding on long and leverage chips on position card so that become same with the bottom
```

**47.**
```
reduce the top padding
```

**48.**
```
<span class="font-['Inter',sans-serif] font-semibold text-[10px] leading-[14px]" style="color: rgb(37, 167, 100);">Long</span> tihs one
```

**49.**
```
still the same becuase i think u set the heigh dynamic so that component follow the other
```

**50.**
```
make and md file for the entier prompt that i use for this project and add the prompt  everytime as ask u to do something
```

**51.**
```
from the very begining
```

**52.**
```
add also the full css or html or code that i use on the prompt
```

**53.**
```
dont truncate the prompt display it as detail as i type
```

---

## Session 8 — Chart Price Label

**54.**
```
still at the right of that component Create a vertical crypto trading price level scale (price ladder) UI component.
The component displays a column of price levels increasing from bottom to top with equal spacing between each value.
Example range around 70,400 to 71,040 with increments of 40.
Each price is displayed in a compact trading interface style similar to a professional exchange orderbook.

One level represents the current price, displayed with a horizontal marker across the column.
The current price shows the value 70,715.6 and includes a small countdown timer below it (00:17).

The interface should look like a modern crypto trading terminal, minimal, dense, and optimized for fast readability.
Typography should resemble exchange trading platforms where numbers are aligned consistently for quick scanning.
```

**58.**
```
still cannot see the chart history and still cannot be scrolled
```
```
make the chart can be scrolled to left
```
```
make the chart can be zoomed out or in
```
